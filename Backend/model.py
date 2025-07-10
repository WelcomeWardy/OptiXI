import pandas as pd
import numpy as np
import random
import functools
import hashlib
import pickle
import logging
import google.generativeai as genai

class Model:

    def __init__(self):
        self.result = []
        self.df = pd.read_csv(r"Datasets\18-11_FINAL_DATASET_WITH_STYLES_BOOSTED.csv")
        self.dffull = self.df
        self.present_df = self.df[(self.df["Ending Year"] == "Present") & (self.df["Current Season"] == 0)]
        genai.configure(api_key="AIzaSyDPzbU5OKeZghLcANqIYoEV_7qHzkbBinM")
        self.models = genai.GenerativeModel(model_name="gemma-3n-e4b-it")
        try:
            self.batting_ground_df = pd.read_csv(r"Datasets\batting_stats_by_ground_filtered.csv")
            self.bowling_ground_df = pd.read_csv(r"Datasets\bowling_stats_by_ground_filtered.csv")
            print("Ground-specific performance data loaded successfully")
        except FileNotFoundError as e:
            print(f"Warning: {e}. Proceeding without ground-specific data.")
            self.batting_ground_df = pd.DataFrame()
            self.bowling_ground_df = pd.DataFrame()
        if not self.batting_ground_df.empty:
            print("Batting Ground Score Stats:")
            print(f"Min: {self.batting_ground_df['Batting_Score'].min()}")
            print(f"Max: {self.batting_ground_df['Batting_Score'].max()}")
            print(f"Mean: {self.batting_ground_df['Batting_Score'].mean():.2f}")
            print(f"Median: {self.batting_ground_df['Batting_Score'].median():.2f}")

        if not self.bowling_ground_df.empty:
            print("Bowling Ground Score Stats:")
            print(f"Min: {self.bowling_ground_df['BowlingScore'].min()}")
            print(f"Max: {self.bowling_ground_df['BowlingScore'].max()}")
            print(f"Mean: {self.bowling_ground_df['BowlingScore'].mean():.2f}")
            print(f"Median: {self.bowling_ground_df['BowlingScore'].median():.2f}")
        self.TEAM_HOME_GROUNDS = {
            "CSK": "MA Chidambaram Stadium ",
            "MI": "Wankhede Stadium ",
            "RCB": "M Chinnaswamy Stadium ",
            "KKR": "Eden Gardens ",
            "DC": "Arun Jaitley Stadium ",
            "RR": "Sawai Mansingh Stadium ",
            "PBKS": "Maharaja Yadavindra Singh International Cricket St ",
            "GT": "Narendra Modi Stadium ",
            "LSG": "BRSABV Ekana Cricket Stadium ",
            "SRH": "Rajiv Gandhi International Stadium "
        }
        # Exclude teams

        # Convert Overseas column
        if self.df["Overseas"].dtype != bool:
            self.df["Overseas"] = self.df["Overseas"].astype(str).str.lower().str.strip()
            self.df["Overseas"] = self.df["Overseas"].map({
                'yes': True, 'no': False,
                'true': True, 'false': False,
                '1': True, '0': False
            })
        self.df2 = self.df
        excluded_teams = ["PWI", "KTK", "RPS", "GL"]
        self.df = self.df[~self.df["Team"].isin(excluded_teams)]
        self.df = self.df[self.df["Current Season"] == 1]
        # Define required roles with weights (reduced importance)
        self.required_roles = {
            "Wicketkeeper": 1,
            "Explosive Opener": 1,
            "Consistent Batter": 1,
            "Hard Hitter": 1,
            "Anchor Batter": 1,
            "Batting Allrounder": 1,
            "Bowling Allrounder": 1,
            "Balanced Allrounder": 1,
            "New Ball Specialist": 1,
            "Death Overs Specialist": 1,
            "Middle Overs Specialist": 1,
            "All-Phase Bowler": 1
        }

        # Reduced constraint importance weights (fitness now takes priority)
        self.constraint_weights = {
            "Wicketkeeper": 3,  # Reduced from 10
            "Death Overs Specialist": 2,  # Reduced from 8
            "New Ball Specialist": 2,  # Reduced from 8
            "Explosive Opener": 1.5,  # Reduced from 6
            "Consistent Batter": 1,  # Reduced from 5
            "Hard Hitter": 1,  # Reduced from 5
            "Anchor Batter": 1,  # Reduced from 5
            "Batting Allrounder": 1,  # Reduced from 4
            "Bowling Allrounder": 1,  # Reduced from 4
            "Balanced Allrounder": 1,  # Reduced from 4
            "Middle Overs Specialist or All-Phase": 3  # Reduced from 6
        }
        self.teams = self.df["Team"].unique()
        # Configuration constants
        self.PERFORMANCE_CONFIG = {
            'min_multiplier': 0.95,
            'max_multiplier': 1.05,
            'multiplier_range': 0.10,  # max - min
            'batting_score_col': 'Batting_Score',
            'bowling_score_col': 'BowlingScore'
        }
    def get_df(self,players):
        df2 = self.df2[self.df2['Name'].isin(players)]
        df2["Team"] = "Player_Team" 
        return df2
        
    @staticmethod
    def debug_indexing_issue(df, indices, function_name="Unknown"):
        """Debug function to identify indexing issues"""
        print(f"\n=== DEBUG: {function_name} ===")
        print(f"DataFrame shape: {df.shape}")
        print(f"DataFrame index type: {type(df.index)}")
        print(f"DataFrame index: {df.index.tolist()}")
        print(f"Provided indices: {indices}")
        print(f"Indices type: {type(indices)}")
        if indices:
            print(f"Indices length: {len(indices)}")
            print(f"Max index: {max(indices) if indices else 'N/A'}")
            print(f"Min index: {min(indices) if indices else 'N/A'}")
        print("=" * 40)

    @staticmethod
    def validate_indices(indices, df_length):
        """Validate that indices are within DataFrame bounds and are integers"""
        if not indices:
            return []

        # Ensure indices are integers and within bounds
        valid_indices = []
        for idx in indices:
            if isinstance(idx, (int, np.integer)) and 0 <= idx < df_length:
                valid_indices.append(int(idx))

        return valid_indices

    def safe_iloc(self,df, indices):
        """Safely access DataFrame rows with error handling"""
        try:
            validated_indices = self.validate_indices(indices, len(df))
            if not validated_indices:
                return pd.DataFrame()  # Return empty DataFrame if no valid indices
            return df.iloc[validated_indices]
        except Exception as e:
            print(f"Error in safe_iloc: {e}")
            print(f"Indices: {indices}")
            print(f"DataFrame shape: {df.shape}")
            return pd.DataFrame()


    # Add this after loading the ground data to understand your score distribution
    # Team to home ground mapping
    # Filter only current season players

    # Teams list
    @staticmethod
    def make_hashable(obj):
        """Convert unhashable types to hashable representations for caching."""
        if isinstance(obj, (list, tuple, set)):
            return tuple(Model.make_hashable(e) for e in obj)
        elif isinstance(obj, dict):
            return tuple(sorted((Model.make_hashable(k), Model.make_hashable(v)) for k, v in obj.items()))
        elif hasattr(obj, 'values') and callable(obj.values):  # For pandas Series
            try:
                # Try to create a hashable representation of a pandas Series
                return tuple(obj.values)
            except:
                # If that fails, convert to string and hash that
                return hashlib.md5(str(obj).encode()).hexdigest()
        elif hasattr(obj, 'to_dict') and callable(obj.to_dict):  # For pandas DataFrame
            try:
                # Create a hashable representation of the DataFrame
                return hashlib.md5(pickle.dumps(obj)).hexdigest()
            except:
                # Fallback - this is not ideal but works as a last resort
                return hashlib.md5(str(obj).encode()).hexdigest()
        else:
            # Return the object if it's already hashable
            return obj

    @staticmethod
    def custom_memoize(maxsize=128):
        """Custom memoization decorator for functions with unhashable arguments."""
        def decorator(func):
            cache = {}
            hits = 0
            misses = 0

            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                nonlocal hits, misses

                # Create a hashable key from the arguments
                key_parts = [Model.make_hashable(arg) for arg in args]
                key_parts.extend(sorted((k, Model.make_hashable(v)) for k, v in kwargs.items()))
                key = hash(str(tuple(key_parts)))  # Convert to string first to ensure hashability

                # Check if result is in cache
                if key in cache:
                    hits += 1
                    return cache[key]

                # Compute result and cache it
                misses += 1
                result = func(*args, **kwargs)

                # Manage cache size
                if len(cache) >= maxsize:
                    # Simple strategy: remove a random entry
                    try:
                        cache.pop(next(iter(cache)))
                    except:
                        # If the cache is empty somehow, just continue
                        pass

                cache[key] = result
                return result

            # Add function to clear the cache
            def clear_cache():
                nonlocal hits, misses
                cache.clear()
                hits = 0
                misses = 0

            # Add function to get cache stats
            def cache_info():
                return f"CacheInfo(hits={hits}, misses={misses}, maxsize={maxsize}, currsize={len(cache)})"

            wrapper.clear_cache = clear_cache
            wrapper.cache_info = cache_info
            return wrapper

        return decorator

    @functools.lru_cache(maxsize=1024)
    def get_ground_performance_boost(self,player_name: str, team: str, ground_data_type: str = "batting") -> float:
        """
        Get ground-specific performance boost for a player using percentile-based approach.

        Args:
            player_name: Name of the player
            team: Team code
            ground_data_type: Either "batting" or "bowling"

        Returns:
            float: Multiplier (1.0 = no change, >1.0 = boost, <1.0 = penalty)
        """
        # Validate inputs
        if ground_data_type not in ["batting", "bowling"]:
            logging.warning(f"Invalid ground_data_type: {ground_data_type}")
            return 1.0

        if team not in self.TEAM_HOME_GROUNDS:
            return 1.0

        home_ground = self.TEAM_HOME_GROUNDS[team]

        try:
            # Get appropriate dataframe and score column
            df, score_col = self._get_dataframe_and_column(ground_data_type)

            if df is None or df.empty:
                return 1.0

            # Get player's ground performance
            player_score = self._get_player_ground_score(df, player_name, home_ground, score_col)

            if player_score is None:
                return 1.0

            # Calculate percentile-based multiplier
            return self._calculate_percentile_multiplier(df, home_ground, score_col, player_score)

        except Exception as e:
            logging.error(f"Error getting ground performance for {player_name}: {e}")
            return 1.0


    def _get_dataframe_and_column(self,ground_data_type: str) -> tuple:
        """Get the appropriate dataframe and score column based on data type."""

        if ground_data_type == "batting":
            return (
                self.batting_ground_df if not self.batting_ground_df.empty else None,
                self.PERFORMANCE_CONFIG['batting_score_col']
            )
        else:  # bowling
            return (
                self.bowling_ground_df if not self.bowling_ground_df.empty else None,
                self.PERFORMANCE_CONFIG['bowling_score_col']
            )


    def _get_player_ground_score(self,df: pd.DataFrame, player_name: str, home_ground: str, score_col: str):
        """Extract player's score for the specific ground."""
        # Pre-process strings to avoid repeated operations
        player_name_clean = player_name.strip()
        home_ground_clean = home_ground.strip()

        # Filter for player and ground
        player_data = df[
            (df["Name"].str.strip() == player_name_clean) &
            (df["Ground"].str.strip() == home_ground_clean)
        ]

        if player_data.empty:
            return None

        ground_score = player_data[score_col].iloc[0]

        # Validate score
        if pd.isna(ground_score) or ground_score <= 0:
            return None

        return ground_score


    def _calculate_percentile_multiplier(self,df: pd.DataFrame, home_ground: str, score_col: str, player_score: float) -> float:
        """Calculate percentile-based performance multiplier."""
        # Get all scores for this ground
        ground_scores = df[
            df["Ground"].str.strip() == home_ground.strip()
        ][score_col].dropna()

        if len(ground_scores) == 0:
            return 1.0

        # Calculate percentile rank
        percentile = (ground_scores <= player_score).mean()

        # Convert to multiplier using configuration
        config = self.PERFORMANCE_CONFIG
        multiplier = config['min_multiplier'] + (percentile * config['multiplier_range'])

        # Ensure bounds
        return max(min(multiplier, config['max_multiplier']), config['min_multiplier'])



    @functools.lru_cache(maxsize=256)
    def _get_ground_scores_cached(self,ground_name: str, data_type: str) -> tuple:
        """Cache ground scores to avoid repeated DataFrame operations."""
        df, score_col = self._get_dataframe_and_column(data_type)

        if df is None or df.empty:
            return tuple()

        ground_scores = df[
            df["Ground"].str.strip() == ground_name.strip()
        ][score_col].dropna()

        return tuple(ground_scores.values)  # Convert to tuple for caching

    @custom_memoize(maxsize=2048)
    def get_individual_fitness(self,player, team=None):
        """
        Calculate individual player fitness with optional ground-specific boost
        """
        role = player["Player Role"]
        batting_style = player["Batting Style"]
        bowling_style = player["Bowling Style"]
        player_name = player["Name"]

        # Get base fitness
        base_batting = player["Overall Batting (Weighted)"]
        base_bowling = player["Overall Bowling (Weighted)"]

        # Apply ground-specific boosts if team is provided
        if team:
            batting_boost = self.get_ground_performance_boost(player_name, team, "batting")
            bowling_boost = self.get_ground_performance_boost(player_name, team, "bowling")

            adjusted_batting = base_batting * batting_boost
            adjusted_bowling = base_bowling * bowling_boost
        else:
            adjusted_batting = base_batting
            adjusted_bowling = base_bowling

        # Calculate fitness based on role
        if role in ["Wicketkeeper"] or batting_style in ["Explosive Opener", "Consistent Batter", "Hard Hitter", "Anchor Batter"]:
            return adjusted_batting * 0.7 + adjusted_bowling * 0.3
        elif bowling_style in ["New Ball Specialist", "Death Overs Specialist", "Middle Overs Specialist", "All-Phase Bowler"]:
            return adjusted_bowling * 0.7 + adjusted_batting * 0.3
        elif role in ["Batting Allrounder", "Bowling Allrounder", "Balanced Allrounder"]:
            return adjusted_batting * 0.5 + adjusted_bowling * 0.5
        elif role in ["Batting Allrounder"] and bowling_style in ["Middle overs Specialist"]:
            return adjusted_batting * 0.7 + adjusted_bowling * 0.3
        elif role in ["Bowling Allrounder"] and batting_style in ["Middle overs Specialist"]:
            return adjusted_batting * 0.3 + adjusted_bowling * 0.7
        elif role in ["Balanced Allrounder"]:
            return adjusted_batting * 0.5 + adjusted_bowling * 0.5
        else:
            return adjusted_batting + adjusted_bowling

    @custom_memoize(maxsize=1024)
    def count_constraints_met(self,team_df, player_indices, anchor_batter_checking=False):
        role_count = dict.fromkeys(self.required_roles, 0)
        overseas_count = 0
        selected_players = self.safe_iloc(team_df,player_indices)
        if selected_players.empty:
            return 0, False, 0, role_count

        for _, player in selected_players.iterrows():
            role = player["Player Role"]
            batting = player["Batting Style"]
            bowling = player["Bowling Style"]

            if role == "Wicketkeeper":
                role_count["Wicketkeeper"] += 1
            if batting == "Explosive Opener":
                role_count["Explosive Opener"] += 1
            if batting == "Consistent Batter":
                role_count["Consistent Batter"] += 1
            if batting == "Hard Hitter":
                role_count["Hard Hitter"] += 1
            if batting == "Anchor Batter":
                role_count["Anchor Batter"] += 1
            if role == "Batting Allrounder":
                role_count["Batting Allrounder"] += 1
            if role == "Bowling Allrounder":
                role_count["Bowling Allrounder"] += 1
            if role == "Balanced Allrounder":
                role_count["Balanced Allrounder"] += 1
            if bowling == "New Ball Specialist":
                role_count["New Ball Specialist"] += 1
            if bowling == "Death Overs Specialist":
                role_count["Death Overs Specialist"] += 1
            if bowling in ["Middle Overs Specialist"]:
                role_count["Middle Overs Specialist"] += 1
            if bowling in ["All-Phase Bowler"]:
                role_count["All-Phase Bowler"] += 1

            if role in self.required_roles:
                role_count[role] += 1

            if player["Overseas"]:
                overseas_count += 1

        met = 0
        weighted_score = 0
        for role, required in self.required_roles.items():
            if not anchor_batter_checking:
                if role_count[role] >= required:
                    met += 1
                    weighted_score += self.constraint_weights.get(role, 1)
            else:
                if role_count[role] >= required:
                    met += 1
                    weighted_score += self.constraint_weights.get(role, 1)
                elif role == "Anchor Batter" and role_count["Consistent Batter"] >= required:
                    met += 1
                    weighted_score += self.constraint_weights.get(role, 1)

        overseas_valid = overseas_count <= 4
        return met, overseas_valid, weighted_score, role_count

    @custom_memoize(maxsize=512)
    def count_role_duplicates(self,team_df, player_indices):
        role_counts = {}
        selected_players = team_df.iloc[player_indices]

        for _, player in selected_players.iterrows():
            role = player["Player Role"]
            role_counts[role] = role_counts.get(role, 0) + 1

        duplicates = sum(max(0, count - 1) for count in role_counts.values())
        return duplicates

    @staticmethod
    def team_similarity(team1, team2):
        intersection = len(set(team1) & set(team2))
        return intersection / 12.0

    @custom_memoize(maxsize=512)
    def calculate_fitness(self,player_df, team=None):
        """
        Calculate total team fitness with safe indexing
        """
        if player_df.empty:
            return 0

        total_fitness = 0
        for _, player in player_df.iterrows():
            total_fitness += self.get_individual_fitness(player, team)
        return total_fitness



    @custom_memoize(maxsize=1024)
    def enhanced_fitness_with_penalties(self,team_df, player_indices, constraints_met, overseas_valid, weighted_score, team=None):
        # Ensure unique players only - FIXED DUPLICATE ISSUE
        unique_indices = list(set(player_indices))
        if len(unique_indices) < 12:
            # If we have duplicates, this is an invalid team
            return -10000  # Very low fitness for invalid teams

        base_fitness = self.calculate_fitness(team_df.iloc[player_indices], team)

        # FIXED: Much smaller penalties to prevent negative fitness
        penalty = 0

        # Only penalize heavily for missing wicketkeeper (absolutely critical)
        _, _, _, role_count = self.count_constraints_met(team_df, player_indices)

        if role_count["Wicketkeeper"] == 0:
            penalty += 50  # Reduced from 200

        # Light penalties for other critical roles
        if role_count["New Ball Specialist"] == 0:
            penalty += 20  # Reduced from 50
        if role_count["Death Overs Specialist"] == 0:
            penalty += 20  # Reduced from 50

        # Overseas penalty (still important)
        if not overseas_valid:
            penalty += 30  # Reduced from 300

        # Very light role duplicate penalty
        duplicates = self.count_role_duplicates(team_df, player_indices)
        penalty += duplicates * 5  # Reduced from 20

        # FIXED: Ensure fitness is always positive
        final_fitness = base_fitness + weighted_score * 10 - penalty
        return max(final_fitness, 1)  # Ensure minimum fitness of 1

    @custom_memoize(maxsize=512)
    def ensure_unique_team(self,team_indices, team_df):
        """Ensure no duplicate players in team - FIXED INDEXING ISSUE"""
        if not team_indices:
            return []

        # Validate and convert indices
        validated_indices = self.validate_indices(team_indices, len(team_df))

        unique_team = []
        used_indices = set()

        # Add unique valid indices
        for idx in validated_indices:
            if idx not in used_indices:
                unique_team.append(idx)
                used_indices.add(idx)
                if len(unique_team) >= 12:
                    break

        # If we need more players, add available ones
        while len(unique_team) < 12:
            available = [i for i in range(len(team_df)) if i not in used_indices]
            if not available:
                break
            unique_team.append(available[0])
            used_indices.add(available[0])

        return unique_team[:12]


    def generate_strategic_population(self,team_df, population_size=100, team=None):
        population = []
        team_size = len(team_df)

        if team_size < 12:
            return population

        def get_role_fitness(player):
            return self.get_individual_fitness(player, team)

        # 50% pure fitness-based teams (best overall players regardless of role)
        fitness_count = max(1, population_size // 2)
        for _ in range(fitness_count):
            # First, get best 4 overseas players
            overseas_players = [(idx, get_role_fitness(team_df.loc[idx]))
                              for idx in range(len(team_df))
                              if team_df.loc[idx]["Overseas"]]
            overseas_players.sort(key=lambda x: x[1], reverse=True)
            best_overseas = [idx for idx, _ in overseas_players[:4]]

            # Sort all players by fitness and pick top 12
            player_fitness = [(idx, get_role_fitness(player)) for idx, player in team_df.iterrows()]
            player_fitness.sort(key=lambda x: x[1], reverse=True)

            fitness_team = []
            tried_players = set()

            for idx, fitness in player_fitness:
                if len(fitness_team) >= 12:
                    break

                if idx in tried_players:
                    continue

                tried_players.add(idx)
                player = team_df.loc[idx]

                # Only allow best 4 overseas players
                if player["Overseas"] and idx not in best_overseas:
                    continue

                fitness_team.append(idx)

            # If we still don't have 12, add remaining players ignoring overseas constraint
            if len(fitness_team) < 12:
                remaining_players = [idx for idx in range(len(team_df)) if idx not in fitness_team]
                needed = 12 - len(fitness_team)
                fitness_team.extend(remaining_players[:needed])

            # FIXED: Ensure unique players
            fitness_team = self.ensure_unique_team(fitness_team, team_df)
            if len(fitness_team) == 12:
                population.append(fitness_team)

        # 30% role-aware but fitness-prioritized teams
        role_fitness_count = max(1, population_size * 3 // 10)
        for _ in range(role_fitness_count):
            role_fitness_team = []
            used_players = set()

            # First ensure we have a wicketkeeper (only critical constraint)
            wk_players = [(idx, get_role_fitness(player)) for idx, player in team_df.iterrows()
                          if player["Player Role"] == "Wicketkeeper"]
            if wk_players:
                best_wk = max(wk_players, key=lambda x: x[1])[0]
                role_fitness_team.append(best_wk)
                used_players.add(best_wk)

            # Fill remaining positions with best available players by fitness
            remaining_players = [(idx, get_role_fitness(player)) for idx, player in team_df.iterrows()
                               if idx not in used_players]
            remaining_players.sort(key=lambda x: x[1], reverse=True)

            overseas_count = 1 if role_fitness_team and team_df.loc[role_fitness_team[0]]["Overseas"] else 0

            for idx, fitness in remaining_players:
                if len(role_fitness_team) >= 12:
                    break

                player = team_df.loc[idx]
                if player["Overseas"] and overseas_count >= 4:
                    continue

                role_fitness_team.append(idx)
                if player["Overseas"]:
                    overseas_count += 1

            # Fill remaining if needed
            if len(role_fitness_team) < 12:
                remaining = [idx for idx in range(len(team_df)) if idx not in used_players]
                needed = 12 - len(role_fitness_team)
                role_fitness_team.extend(remaining[:needed])

            # FIXED: Ensure unique players
            role_fitness_team = self.ensure_unique_team(role_fitness_team, team_df)
            if len(role_fitness_team) == 12:
                population.append(role_fitness_team)

        # Fill remaining with random teams
        while len(population) < population_size:
            if len(population) > population_size * 2:  # Safety break
                break
            # FIXED: Use sample without replacement to avoid duplicates
            indices = random.sample(range(team_size), min(12, team_size))
            indices = self.ensure_unique_team(indices, team_df)
            if len(indices) == 12:
                population.append(indices)
        validated_population = []
        for individual in population:
            validated_individual = self.ensure_unique_team(individual, team_df)
            if len(validated_individual) == 12:
                validated_population.append(validated_individual)

        return validated_population

    def maintain_diversity(self,population):
        unique_population = []

        for individual in population:
            is_unique = True
            for existing in unique_population:
                if self.team_similarity(individual, existing) > 0.8:
                    is_unique = False
                    break

            if is_unique:
                unique_population.append(individual)

        return unique_population if unique_population else population[:1]

    def targeted_mutation(self,individual, team_df, team=None):
        # FIXED: Ensure we work with unique players
        individual = self.ensure_unique_team(individual, team_df)
        team_players = team_df.iloc[individual]

        weakest_idx = 0
        min_fitness = float('inf')

        for i, (_, player) in enumerate(team_players.iterrows()):
            player_fitness = self.get_individual_fitness(player, team)
            if player_fitness < min_fitness:
                min_fitness = player_fitness
                weakest_idx = i

        # Find best available replacement regardless of role
        available_players = [(i, self.get_individual_fitness(team_df.loc[i], team)) for i in range(len(team_df)) if i not in individual]

        if available_players:
            best_replacement = max(available_players, key=lambda x: x[1])[0]
            individual[weakest_idx] = best_replacement

        return self.ensure_unique_team(individual, team_df)

    def role_aware_crossover(self,parent1, parent2, team_df, team=None):
        # FIXED: Ensure parents have unique players
        parent1 = self.ensure_unique_team(parent1, team_df)
        parent2 = self.ensure_unique_team(parent2, team_df)

        child = []
        used_players = set()

        # Only ensure wicketkeeper is covered (most critical)
        wk_found = False
        for parent in [parent1, parent2]:
            for player_idx in parent:
                if team_df.loc[player_idx]["Player Role"] == "Wicketkeeper" and player_idx not in used_players:
                    child.append(player_idx)
                    used_players.add(player_idx)
                    wk_found = True
                    break
            if wk_found:
                break

        # Combine remaining players from both parents, prioritizing by fitness
        remaining_candidates = []
        for parent in [parent1, parent2]:
            for player_idx in parent:
                if player_idx not in used_players:
                    remaining_candidates.append((player_idx, self.get_individual_fitness(team_df.loc[player_idx], team)))

        # Sort by fitness and pick best available
        remaining_candidates.sort(key=lambda x: x[1], reverse=True)
        overseas_count = 1 if wk_found and team_df.loc[child[0]]["Overseas"] else 0

        for player_idx, fitness in remaining_candidates:
            if len(child) >= 12:
                break

            player = team_df.loc[player_idx]
            if player["Overseas"] and overseas_count >= 4:
                continue

            child.append(player_idx)
            used_players.add(player_idx)
            if player["Overseas"]:
                overseas_count += 1

        # Fill any remaining positions - simplified approach
        if len(child) < 12:
            remaining_indices = [i for i in range(len(team_df)) if i not in used_players]
            needed = 12 - len(child)
            child.extend(remaining_indices[:needed])

        return self.ensure_unique_team(child[:12], team_df)

    @staticmethod
    def tournament_selection(evaluated_population, tournament_size=2):
        survivors = []
        max_survivors = len(evaluated_population) // 2
        attempts = 0
        max_attempts = len(evaluated_population) * 2  # Safety limit

        while len(survivors) < max_survivors and attempts < max_attempts:
            attempts += 1

            if len(evaluated_population) < tournament_size:
                tournament_size = len(evaluated_population)

            tournament = random.sample(evaluated_population, tournament_size)

            # Prioritize fitness over constraints
            winner = max(tournament, key=lambda x: (
                x[1] if x[3] else x[1] - 100,  # fitness with overseas penalty (primary) - REDUCED PENALTY
                x[2],  # constraints met (secondary)
                -x[5] if len(x) > 5 else 0  # prefer fewer role duplicates
            ))

            # Check if this individual is already selected
            already_selected = False
            for existing in survivors:
                if existing[0] == winner[0]:
                    already_selected = True
                    break

            if not already_selected:
                survivors.append(winner)

        return survivors

    def local_search_refinement(self,best_individual, team_df, team=None):
        # FIXED: Ensure unique players
        improved = self.ensure_unique_team(best_individual[:], team_df)

        for i in range(len(improved)):
            original_fitness = self.enhanced_fitness_with_penalties(team_df, improved, *self.count_constraints_met(team_df, improved)[:3], team)

            # Try replacing with any better player
            best_replacement = None
            best_improvement = 0

            for j in range(len(team_df)):
                if j not in improved:
                    test_team = improved[:]
                    test_team[i] = j

                    test_fitness = self.enhanced_fitness_with_penalties(team_df, test_team, *self.count_constraints_met(team_df, test_team)[:3], team)
                    improvement = test_fitness - original_fitness

                    if improvement > best_improvement:
                        best_improvement = improvement
                        best_replacement = j

            if best_replacement is not None:
                improved[i] = best_replacement

        return self.ensure_unique_team(improved, team_df)

    def has_converged(self,fitness_history, window=5):
        if len(fitness_history) < window:
            return False

        recent_scores = fitness_history[-window:]
        return max(recent_scores) - min(recent_scores) < 0.01

    def adaptive_genetic_algorithm(self,team_df, generations=30, team=None):
        team_df = team_df.reset_index(drop=True)

        if len(team_df) < 12:
            return None, 0, 0

        population_size = min(100, len(team_df) * 2)
        population = self.generate_strategic_population(team_df, population_size, team)

        if not population:
            return None, 0, 0

        best_individual = None
        best_fitness = -float("inf")
        best_constraints = -1
        fitness_history = []

        print(f"Starting genetic algorithm with population size: {len(population)}")

        for gen in range(generations):
            if gen % 5 == 0:  # Progress indicator
                print(f"Generation {gen}/{generations}")

            evaluated_population = []

            survival_rate = 0.5 - (gen / generations) * 0.2
            mutation_rate = 0.027 - (gen / generations) * 0.02

            for individual in population:
                # FIXED: Ensure individual has exactly 12 unique players
                individual = self.ensure_unique_team(individual, team_df)
                if len(individual) != 12:
                    continue  # Skip invalid individuals

                constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, individual)
                fitness = self.enhanced_fitness_with_penalties(team_df, individual, constraints_met, overseas_valid, weighted_score, team)
                role_duplicates = self.count_role_duplicates(team_df, individual)

                evaluated_population.append((individual, fitness, constraints_met, overseas_valid, weighted_score, role_duplicates))

                # Update best based on fitness primarily
                if fitness > best_fitness and overseas_valid:
                    best_constraints = constraints_met
                    best_fitness = fitness
                    best_individual = individual[:]

            fitness_history.append(best_fitness)

            if self.has_converged(fitness_history):
                print(f"Converged at generation {gen}")
                break

            survivors = Model.tournament_selection(evaluated_population, tournament_size=3)

            if not survivors:  # Safety check
                survivors = evaluated_population[:len(evaluated_population)//2]

            population = self.maintain_diversity([s[0] for s in survivors])

            next_gen = [s[0][:] for s in survivors]  # Make copies

            # Crossover phase
            crossover_attempts = 0
            max_crossover_attempts = population_size * 2

            while len(next_gen) < int(population_size * (1 - mutation_rate)) and crossover_attempts < max_crossover_attempts:
                crossover_attempts += 1

                if len(survivors) >= 2:
                    parent1, parent2 = random.sample(survivors, 2)
                    child = self.role_aware_crossover(parent1[0], parent2[0], team_df, team)
                    if len(child) == 12:
                        next_gen.append(child)
                else:
                    break

            # Mutation phase
            mutation_attempts = 0
            max_mutation_attempts = population_size

            while len(next_gen) < population_size and mutation_attempts < max_mutation_attempts:
                mutation_attempts += 1

                if survivors:
                    individual = random.choice(survivors)[0][:]
                    mutated = self.targeted_mutation(individual, team_df, team)
                    if len(mutated) == 12:
                        next_gen.append(mutated)
                else:
                    # Fill with random teams if needed - FIXED
                    available_indices = list(range(len(team_df)))
                    if len(available_indices) >= 12:
                        indices = random.sample(available_indices, 12)
                        next_gen.append(indices)

            population = next_gen[:population_size]  # Ensure population size limit

        if best_individual:
            print("Applying local search refinement...")
            best_individual = self.local_search_refinement(best_individual, team_df, team)

        return best_individual, best_fitness, best_constraints

    # Complete the incomplete parts of your code

    # 1. Complete the anchor_batter_check function (the incomplete part at the end)
    def anchor_batter_check(self,best_indices, team_df, consistent_batter_exists, team=None):
        """
        Check if anchor batter can be replaced with a better batsman when consistent batter exists
        """
        if not consistent_batter_exists:
            return best_indices, False  # No change if no consistent batter

        # Find anchor batter in the team
        anchor_batter_idx = None
        anchor_position = None

        for i, idx in enumerate(best_indices):
            if team_df.loc[idx, "Batting Style"] == "Anchor Batter":
                anchor_batter_idx = idx
                anchor_position = i
                break

        if anchor_batter_idx is None:
            return best_indices, False  # No anchor batter found

        # Get anchor batter's fitness
        anchor_fitness = self.get_individual_fitness(team_df.loc[anchor_batter_idx], team)
        print(f"Current Anchor Batter fitness: {anchor_fitness:.2f}")

        # Find all available batsmen (not in current team) who are better
        available_batsmen = []
        current_overseas_count = sum(1 for idx in best_indices if team_df.loc[idx, "Overseas"])

        for idx, player in team_df.iterrows():
            if idx not in best_indices:
                # Check if this player is a better batsman
                player_fitness = self.get_individual_fitness(player, team)

                # Only consider if they are better than the current anchor batter
                if player_fitness > anchor_fitness:
                    # Check overseas constraint
                    if player["Overseas"] and current_overseas_count >= 4:
                        continue  # Skip if this would violate overseas limit

                    # Prefer batsmen but allow any role if they're much better
                    role_preference_score = 0
                    if player["Batting Style"] in ["Explosive Opener", "Consistent Batter", "Hard Hitter"]:
                        role_preference_score = 1.0
                    elif player["Player Role"] in ["Wicketkeeper", "Batting Allrounder", "Balanced Allrounder"]:
                        role_preference_score = 0.8
                    else:
                        role_preference_score = 0.5

                    # Add preference bonus to fitness
                    adjusted_fitness = player_fitness + (role_preference_score * 10)
                    available_batsmen.append((idx, adjusted_fitness, player["Name"]))

        if not available_batsmen:
            print("No better batsman available to replace anchor batter")
            return best_indices, False

        # Find the best replacement
        best_replacement = max(available_batsmen, key=lambda x: x[1])
        replacement_idx, replacement_fitness, replacement_name = best_replacement

        print(f"Found better batsman: {replacement_name} with fitness {replacement_fitness:.2f}")

        # Calculate current team fitness
        current_constraints_met, current_overseas_valid, current_weighted_score, _ = self.count_constraints_met(team_df, best_indices)
        current_team_fitness = self.enhanced_fitness_with_penalties(team_df, best_indices, current_constraints_met, current_overseas_valid, current_weighted_score, team)

        # Create new team with replacement
        new_team = best_indices.copy()
        new_team[anchor_position] = replacement_idx

        # Calculate new team fitness
        new_constraints_met, new_overseas_valid, new_weighted_score, _ = self.count_constraints_met(team_df, new_team, True)
        new_team_fitness = self.enhanced_fitness_with_penalties(team_df, new_team, new_constraints_met, new_overseas_valid, new_weighted_score, team)

        print(f"Current team fitness: {current_team_fitness:.2f}")
        print(f"New team fitness: {new_team_fitness:.2f}")

        # Replace if new team fitness is better
        if new_team_fitness > current_team_fitness:
            anchor_name = team_df.loc[anchor_batter_idx, "Name"]
            print(f"✓ Replacing {anchor_name} with {replacement_name}")
            print(f"✓ Team fitness improved by {new_team_fitness - current_team_fitness:.2f}")
            return new_team, True
        else:
            print("No replacement made - team fitness would not improve")
            return best_indices, False

    # 2. Fix the consistent_batter_exists logic in the main loop
    # Replace this line in your main loop:
    # consistent_batter_exists = consistent_batter_check.empty

    # With this corrected logic:
    @staticmethod
    def check_consistent_batter_exists(best_players):
        """Check if consistent batter exists in the team"""
        consistent_batter_check = best_players[best_players["Batting Style"] == "Consistent Batter"]
        return not consistent_batter_check.empty  # Returns True if consistent batter exists

    # 3. Add bowling specialist check functionality
    @staticmethod
    def check_bowling_specialists_exist(best_players):
        """Check if death bowler and new-ball specialists exist"""
        death_bowler_exists = not best_players[best_players["Bowling Style"] == "Death Overs Specialist"].empty
        new_ball_exists = not best_players[best_players["Bowling Style"] == "New Ball Specialist"].empty
        return death_bowler_exists, new_ball_exists

    def bowling_specialist_check(self,best_indices, team_df, death_bowler_exists, new_ball_exists):
        """
        Check if death bowler and new-ball specialists can be replaced with better bowlers

        Returns:
        - Updated team indices and boolean indicating if changes were made
        """
        if not death_bowler_exists and not new_ball_exists:
            return best_indices, False  # No change if no specialists exist

        team_changed = False
        current_team = best_indices.copy()

        # Check if all-phase constraint is met (need at least one all-phase bowler)
        all_phase_count = sum(1 for idx in current_team
                             if team_df.loc[idx, "Bowling Style"] == "All-Phase Bowler")

        if all_phase_count == 0:
            print("No all-phase bowler in team - returning existing team")
            return best_indices, False

        # Process death bowler replacement if exists
        if death_bowler_exists:
            current_team, death_changed = self.process_specialist_replacement(
                current_team, team_df, "Death Overs Specialist", "death bowler"
            )
            if death_changed:
                team_changed = True

        # Process new-ball specialist replacement if exists
        if new_ball_exists:
            current_team, new_ball_changed = self.process_specialist_replacement(
                current_team, team_df, "New Ball Specialist", "new-ball specialist"
            )
            if new_ball_changed:
                team_changed = True

        return current_team, team_changed


    def process_specialist_replacement(self,current_team, team_df, bowling_style, specialist_name):
        """
        Process replacement for a specific bowling specialist
        Returns:
        - Updated team indices and boolean indicating if replacement was made
        """
        # Find the specialist in the team
        specialist_idx = None
        specialist_position = None

        for i, idx in enumerate(current_team):
            if team_df.loc[idx, "Bowling Style"] == bowling_style:
                specialist_idx = idx
                specialist_position = i
                break

        if specialist_idx is None:
            print(f"No {specialist_name} found in team")
            return current_team, False

        # Get specialist's fitness
        specialist_fitness = self.get_individual_fitness(team_df.loc[specialist_idx])
        specialist_name_actual = team_df.loc[specialist_idx, "Name"]
        print(f"Current {specialist_name} ({specialist_name_actual}) fitness: {specialist_fitness:.2f}")

        # Find all available bowlers (not in current team) who are better
        available_bowlers = []
        current_overseas_count = sum(1 for idx in current_team if team_df.loc[idx, "Overseas"])

        for idx, player in team_df.iterrows():
            if idx not in current_team:  # Player not in current team
                # Check if player is a bowler (has bowling-focused role or bowling style)
                is_bowler = (
                    player["Player Role"] in ["Bowler", "Bowling Allrounder", "Balanced Allrounder"] or
                    player["Bowling Style"] in ["Death Overs Specialist", "New Ball Specialist ", "All-Phase Bowler","Middle Overs Specialist"]
                )

                if is_bowler:
                    player_fitness = self.get_individual_fitness(player)

                    # Check overseas constraint
                    if player["Overseas"] and current_overseas_count >= 4 and not team_df.loc[specialist_idx, "Overseas"]:
                        continue  # Skip if would violate overseas limit

                    if player_fitness > specialist_fitness:
                        available_bowlers.append((idx, player_fitness, player["Name"], player["Bowling Style"]))

        if not available_bowlers:
            print(f"No better bowler available to replace {specialist_name}")
            return current_team, False

        # Find the best replacement
        best_replacement = max(available_bowlers, key=lambda x: x[1])
        replacement_idx, replacement_fitness, replacement_name, replacement_style = best_replacement

        print(f"Found better bowler: {replacement_name} ({replacement_style}) with fitness {replacement_fitness:.2f}")

        # Calculate current team fitness
        current_constraints_met, current_overseas_valid, current_weighted_score, _ = self.count_constraints_met(team_df, current_team)
        current_team_fitness = self.enhanced_fitness_with_penalties(team_df, current_team, current_constraints_met, current_overseas_valid, current_weighted_score)

        # Create new team with replacement
        new_team = current_team.copy()
        new_team[specialist_position] = replacement_idx

        # Calculate new team fitness
        new_constraints_met, new_overseas_valid, new_weighted_score, _ = self.count_constraints_met(team_df, new_team, True)
        new_team_fitness = self.enhanced_fitness_with_penalties(team_df, new_team, new_constraints_met, new_overseas_valid, new_weighted_score)

        print(f"Current team fitness: {current_team_fitness:.2f}")
        print(f"New team fitness: {new_team_fitness:.2f}")

        # Replace if new team fitness is better
        if new_team_fitness > current_team_fitness:
            print(f"✓ Replacing {specialist_name_actual} with {replacement_name}")
            print(f"✓ Team fitness improved by {new_team_fitness - current_team_fitness:.2f}")
            return new_team, True
        else:
            print(f"No replacement made for {specialist_name} - team fitness would not improve")
            return current_team, False


    def clear_all_caches(self):
        """Clear all function caches to free memory."""
        self.get_ground_performance_boost.cache_clear()
        self.get_individual_fitness.clear_cache()
        self.count_constraints_met.clear_cache()
        self.enhanced_fitness_with_penalties.clear_cache()
        self.calculate_fitness.clear_cache()
        self.count_role_duplicates.clear_cache()
        self.ensure_unique_team.clear_cache()

        # Optional: uncomment to see messages when caches are cleared
        # print("All caches cleared")

    def print_cache_stats(self):
        """Print cache statistics for monitoring."""
        print("\nCache Statistics:")
        try:
            print(f"get_ground_performance_boost: {self.get_ground_performance_boost.cache_info()}")
        except Exception as e:
            print(f"get_ground_performance_boost stats error: {e}")

        try:
            print(f"get_individual_fitness: {self.get_individual_fitness.cache_info()}")
            print(f"count_constraints_met: {self.count_constraints_met.cache_info()}")
            print(f"enhanced_fitness_with_penalties: {self.enhanced_fitness_with_penalties.cache_info()}")
            print(f"calculate_fitness: {self.calculate_fitness.cache_info()}")
            print(f"count_role_duplicates: {self.count_role_duplicates.cache_info()}")
            print(f"ensure_unique_team: {self.ensure_unique_team.cache_info()}")
        except Exception as e:
            print(f"Cache stats error: {e}")

    def injury_replacement(self,team,team_df,enabled,present_df,players):
        result = []
        if enabled:
            injured_players_idx = []
            injured_players_name = []
            replacement_players = []
            injured_players_roles = []
            for idx,player in team_df.iterrows():
                if team_df.loc[idx, "Name"] in players:
                    injured_players_idx.append(idx)
                    injured_players_name.append(player['Name'])
                    injured_players_roles.append(player['Player Role'])
                    result.append(player["Name"] + "is injured\n")

            if not injured_players_idx:
                result.append("No players who are injured exist")
                return False,team_df,True,result
            team_df = team_df[~team_df["Name"].isin(players)]
            overseas_count = team_df['Overseas'].sum()
            for i in range(len(injured_players_name)):
                player, idx, present_df, overseas_count = self.get_injured_replacement(present_df, overseas_count, team, injured_players_roles[i])
                if player is None:
                    result.append(f"No replacement found for {injured_players_name[i]}")
                    continue
                replacement_players.append((player["Name"], idx))
                result.append(f"Found better player for {injured_players_name[i]} is {player['Name']}")
                team_df = pd.concat([team_df, pd.DataFrame([player])], ignore_index=True)
            return True,team_df,True,result
        else:

            return False,team_df,False,result


    def get_injured_replacement(self,present_df, curr_overseas_count, team, player_role):
        replacement_player = []
        max_fitness = 0
        got_player_role = False
        for idx, player in present_df.iterrows():
            player_fitness = self.get_individual_fitness(player, team)
            if (player['Player Role'] == player_role):
                got_player_role = True
                if player_fitness > max_fitness:
                    if player['Overseas'] and curr_overseas_count >= 8:
                        continue
                    max_fitness = player_fitness
                    if player['Overseas']:
                        curr_overseas_count += 1
                    replacement_player = [(player, idx, player_fitness)]
            else:
                continue

        if(got_player_role == False):
            for idx, player in present_df.iterrows():
                player_fitness = self.get_individual_fitness(player, team)
                if player_fitness > max_fitness:
                    if player['Overseas'] and curr_overseas_count >= 8:
                        continue
                    max_fitness = player_fitness
                    if player['Overseas']:
                        curr_overseas_count += 1
                    replacement_player = [(player, idx, player_fitness)]

        if not replacement_player:
            print("No valid replacement found.")
            return None, None, present_df, curr_overseas_count

        present_df = present_df[present_df['Name'] != replacement_player[0][0]['Name']]
        return replacement_player[0][0], replacement_player[0][1], present_df, curr_overseas_count

    def dls_mode_adjustment(self,best_indices, team_df, team=None):
        """
        Adjust team composition for DLS scenarios by prioritizing:
        1. Hard Hitters (for quick runs when chasing reduced targets)
        2. Economy bowlers (to restrict opponent's scoring rate)

        Args:
            best_indices: List of current team player indices
            team_df: DataFrame of team players
            team: Team code for ground-specific boosts

        Returns:
            tuple: (updated_indices, changes_made)
        """
        current_team = self.ensure_unique_team(best_indices.copy(), team_df)
        team_changed = False

        # Calculate current team fitness for comparison
        current_constraints_met, current_overseas_valid, current_weighted_score, _ = self.count_constraints_met(team_df,
                                                                                                           current_team)
        current_team_fitness = self.enhanced_fitness_with_penalties(team_df, current_team, current_constraints_met,
                                                               current_overseas_valid, current_weighted_score, team)

        # Step 1: Replace weaker batsmen with Hard Hitters
        current_team, batting_changed = self.optimize_batting_for_dls(current_team, team_df, team)
        if batting_changed:
            team_changed = True

        # Step 2: Replace expensive bowlers with economy bowlers
        current_team, bowling_changed = self.optimize_bowling_for_dls(current_team, team_df, team)
        if bowling_changed:
            team_changed = True

        # Verify team is still valid after changes
        if team_changed:
            current_team = self.ensure_unique_team(current_team, team_df)

            # Calculate new team fitness
            new_constraints_met, new_overseas_valid, new_weighted_score, _ = self.count_constraints_met(team_df,
                                                                                                   current_team)
            new_team_fitness = self.enhanced_fitness_with_penalties(team_df, current_team, new_constraints_met,
                                                               new_overseas_valid, new_weighted_score, team)

            # Only return changes if they improve or maintain team quality
            if new_team_fitness >= current_team_fitness - 50:  # Allow small fitness reduction for DLS benefits
                return current_team, True
            else:
                return best_indices, False

        return current_team, team_changed

    def optimize_batting_for_dls(self,current_team, team_df, team=None):
        """
        Replace non-hard-hitting batsmen with better Hard Hitters for DLS scenarios
        """
        team_changed = False
        current_overseas_count = sum(1 for idx in current_team if team_df.loc[idx, "Overseas"])

        # Find batsmen in current team who are NOT hard hitters
        non_hard_hitters = []
        for i, idx in enumerate(current_team):
            player = team_df.loc[idx]

            # Skip wicketkeeper (essential) and allrounders (balanced utility)
            if player["Player Role"] == "Wicketkeeper":
                continue
            if player["Player Role"] in ["Batting Allrounder", "Bowling Allrounder", "Balanced Allrounder"]:
                continue

            # Target non-hard-hitting batsmen
            if (player["Batting Style"] in ["Consistent Batter", "Anchor Batter", "Explosive Opener"] and
                    player["Batting Style"] != "Hard Hitter"):
                player_fitness = self.get_individual_fitness(player, team)
                non_hard_hitters.append((i, idx, player_fitness, player["Name"], player["Batting Style"]))

        if not non_hard_hitters:
            return current_team, False

        # Sort by fitness (weakest first - more likely to be replaced)
        non_hard_hitters.sort(key=lambda x: x[2])

        # Find available Hard Hitters not in current team
        available_hard_hitters = []
        for idx, player in team_df.iterrows():
            if idx not in current_team and player["Batting Style"] == "Hard Hitter":

                # Check overseas constraint
                if player["Overseas"] and current_overseas_count >= 4:
                    continue

                player_fitness = self.get_individual_fitness(player, team)

                # Calculate DLS-specific batting score (prioritize strike rate and power hitting)
                dls_batting_score = player["Overall Batting (Weighted)"]

                # Boost score if player has good T20 striking ability indicators
                if hasattr(player, 'Strike_Rate') and not pd.isna(player.get('Strike_Rate', np.nan)):
                    if player['Strike_Rate'] > 140:  # High strike rate
                        dls_batting_score *= 1.1

                available_hard_hitters.append((idx, player_fitness, dls_batting_score, player["Name"]))

        if not available_hard_hitters:
            return current_team, False

        # Sort hard hitters by DLS batting score (best first)
        available_hard_hitters.sort(key=lambda x: x[2], reverse=True)

        # Try to replace weakest non-hard-hitters with best hard hitters
        replacements_made = 0
        max_replacements = min(2, len(non_hard_hitters))  # Limit replacements to maintain balance

        for i in range(max_replacements):
            if i >= len(non_hard_hitters) or i >= len(available_hard_hitters):
                break

            # Get weakest non-hard-hitter
            position, old_idx, old_fitness, old_name, old_style = non_hard_hitters[i]

            # Get best available hard hitter
            new_idx, new_fitness, new_dls_score, new_name = available_hard_hitters[i]

            # Only replace if the hard hitter is significantly better or comparable
            fitness_threshold = old_fitness * 0.9  # Allow 10% fitness reduction for DLS benefits

            if new_fitness >= fitness_threshold:
                current_team[position] = new_idx
                team_changed = True
                replacements_made += 1

                # Update overseas count if needed
                if team_df.loc[new_idx, "Overseas"] and not team_df.loc[old_idx, "Overseas"]:
                    current_overseas_count += 1
                elif not team_df.loc[new_idx, "Overseas"] and team_df.loc[old_idx, "Overseas"]:
                    current_overseas_count -= 1

        return current_team, team_changed

    def optimize_bowling_for_dls(self,current_team, team_df, team=None):
        """
        Replace expensive bowlers with more economical bowlers for DLS scenarios
        """
        team_changed = False
        current_overseas_count = sum(1 for idx in current_team if team_df.loc[idx, "Overseas"])

        # Find bowlers in current team
        current_bowlers = []
        for i, idx in enumerate(current_team):
            player = team_df.loc[idx]

            # Identify bowling-capable players (but keep allrounders for balance)
            is_bowler = (
                    player["Player Role"] in ["Bowling Allrounder", "Balanced Allrounder"] or
                    player["Bowling Style"] in ["Death Overs Specialist", "New Ball Specialist",
                                                "Middle Overs Specialist", "All-Phase Bowler"]
            )

            if is_bowler:
                bowling_fitness = player["Overall Bowling (Weighted)"]
                current_bowlers.append((i, idx, bowling_fitness, player["Name"],
                                        player["Bowling Style"], player["Player Role"]))

        if len(current_bowlers) < 2:  # Need minimum bowlers
            return current_team, False

        # Sort by bowling fitness (weakest first)
        current_bowlers.sort(key=lambda x: x[2])

        # Find available better economy bowlers
        available_bowlers = []
        for idx, player in team_df.iterrows():
            if idx not in current_team:

                # Check if player is a bowler
                is_bowler = (
                        player["Player Role"] in ["Bowling Allrounder", "Balanced Allrounder"] or
                        player["Bowling Style"] in ["Death Overs Specialist", "New Ball Specialist",
                                                    "Middle Overs Specialist", "All-Phase Bowler"]
                )

                if is_bowler:
                    # Check overseas constraint
                    if player["Overseas"] and current_overseas_count >= 4:
                        continue

                    bowling_fitness = player["Overall Bowling (Weighted)"]

                    # Calculate DLS bowling score (prioritize economy)
                    dls_bowling_score = bowling_fitness

                    # Boost economy bowlers for DLS scenarios
                    if player["Bowling Style"] in ["Middle Overs Specialist", "All-Phase Bowler"]:
                        dls_bowling_score *= 1.05  # Slight boost for economy specialists

                    available_bowlers.append((idx, bowling_fitness, dls_bowling_score,
                                              player["Name"], player["Bowling Style"]))

        if not available_bowlers:
            return current_team, False

        # Sort by DLS bowling score (best first)
        available_bowlers.sort(key=lambda x: x[2], reverse=True)

        # Try to replace weakest bowlers with better economy bowlers
        replacements_made = 0
        max_replacements = min(2, len(current_bowlers) - 2)  # Keep minimum bowling strength

        # Only replace non-specialist bowlers or weakest specialists
        replaceable_bowlers = [b for b in current_bowlers
                               if b[5] not in ["Wicketkeeper"] and  # Don't replace keeper
                               b[4] not in ["Death Overs Specialist", "New Ball Specialist"]]  # Keep key specialists

        for i in range(min(max_replacements, len(replaceable_bowlers))):
            if i >= len(available_bowlers):
                break

            # Get weakest replaceable bowler
            position, old_idx, old_fitness, old_name, old_style, old_role = replaceable_bowlers[i]

            # Get best available bowler
            new_idx, new_fitness, new_dls_score, new_name, new_style = available_bowlers[i]

            # Only replace if new bowler is better
            if new_fitness > old_fitness * 1.02:  # Require meaningful improvement
                current_team[position] = new_idx
                team_changed = True
                replacements_made += 1

                # Update overseas count if needed
                if team_df.loc[new_idx, "Overseas"] and not team_df.loc[old_idx, "Overseas"]:
                    current_overseas_count += 1
                elif not team_df.loc[new_idx, "Overseas"] and team_df.loc[old_idx, "Overseas"]:
                    current_overseas_count -= 1

        return current_team, team_changed

    def get_dls_team_summary(self,team_df, best_indices):
        """
        Get a summary of team composition optimized for DLS scenarios
        Returns dictionary with team analysis instead of printing
        """
        final_players = team_df.iloc[best_indices]

        # Count hard hitters
        hard_hitters = final_players[final_players["Batting Style"] == "Hard Hitter"]
        hard_hitter_info = []
        for _, player in hard_hitters.iterrows():
            hard_hitter_info.append({
                'name': player['Name'],
                'batting_score': player['Overall Batting (Weighted)']
            })

        # Count economy bowlers
        economy_bowlers = final_players[final_players["Bowling Style"].isin([
            "Middle Overs Specialist", "All-Phase Bowler"
        ])]
        economy_bowler_info = []
        for _, player in economy_bowlers.iterrows():
            economy_bowler_info.append({
                'name': player['Name'],
                'bowling_style': player['Bowling Style'],
                'bowling_score': player['Overall Bowling (Weighted)']
            })

        # Calculate team balance
        total_batting = final_players["Overall Batting (Weighted)"].sum()
        total_bowling = final_players["Overall Bowling (Weighted)"].sum()
        dls_readiness_score = (len(hard_hitters) * 10) + (len(economy_bowlers) * 8)

        return {
            'hard_hitters': {
                'count': len(hard_hitters),
                'players': hard_hitter_info
            },
            'economy_bowlers': {
                'count': len(economy_bowlers),
                'players': economy_bowler_info
            },
            'team_balance': {
                'total_batting_strength': total_batting,
                'total_bowling_strength': total_bowling,
                'dls_readiness_score': dls_readiness_score
            }
        }


    def injury_prediction(self,team,team_df,injury_enabled,ground_team,players):
        print("-" * 50)
        print("\n\nImplementing injury changes\n")
        print("-" * 50)
        result = []
        for i in self.result:
            result.append(i)
        #players = ["Ruturaj Gaikwad", "Musheer Khan", "Axar Patel", "Suyash Sharma", "Sai Sudharsan", "Will Jacks",
        #           "Harsh Dubey", "Mitchell Marsh", "Vaibhav Arora", "Vaibhav Suryavanshi", "Umran Malik",
        #           "Travis Head", "Pat Cummins", "Andre Russell", "Tilak Varma", "Virat Kohli", "Dewald Brevis",
        #           "Ravichandran Ashwin"]
        replaced, new_team_df, CheckForReplacement, goat = self.injury_replacement(team, team_df, injury_enabled,self.present_df, players)
        #for i in goat:
        #    result.append(i)
        if (not CheckForReplacement):
            print("NOT CHECKED FOR REPLACEMENT")
        if (replaced):
            print("NEW REPLACED TEAM IF INJURIES\n\n\n\n ")
        print(f"\n--- Best XI for {team} ---")
        self.clear_all_caches()
        if len(new_team_df) < 12:
            result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")

            # Pass team parameter to genetic algorithm for ground-specific boost
        best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(new_team_df, team=team)

        if best_indices is None:
            result.append("No valid XI found.")

            # FIXED: Final check for unique players
        best_indices = self.ensure_unique_team(best_indices, new_team_df)
        best_players = new_team_df.iloc[best_indices]

        # Check if consistent batter exists (CORRECTED LOGIC)
        consistent_batter_exists = self.check_consistent_batter_exists(best_players)
        print(f"Consistent Batter exists: {consistent_batter_exists}")

        # Apply anchor batter check
        print("\n--- Applying Anchor Batter Check ---")
        best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, new_team_df,
                                                                         consistent_batter_exists, team)

        # Recalculate fitness if replacement was made
        if anchor_replacement_made:
            constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(new_team_df, best_indices)
            best_fit = self.enhanced_fitness_with_penalties(new_team_df, best_indices, constraints_met, overseas_valid,
                                                            weighted_score, team)

        # Check for bowling specialists
        final_players = new_team_df.iloc[best_indices]
        death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

        print(f"Death Bowler exists: {death_bowler_exists}")
        print(f"New Ball Specialist exists: {new_ball_exists}")

        # Apply bowling specialist check
        if death_bowler_exists or new_ball_exists:
            print("\n--- Applying Bowling Specialist Check ---")
            best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, new_team_df,
                                                                                   death_bowler_exists, new_ball_exists)

            # Recalculate fitness if replacement was made
            if bowling_replacement_made:
                constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(new_team_df,
                                                                                                best_indices)
                best_fit = self.enhanced_fitness_with_penalties(new_team_df, best_indices, constraints_met,
                                                                overseas_valid, weighted_score, team)

        # Final team display
        final_players = new_team_df.iloc[best_indices]
        print("\n--- Final Team ---")
        selected_df = final_players[["Name", "Player Role"]]
        result.append("Name | Player Role")
        for _, row in selected_df.iterrows():
            result.append(' | '.join(str(x) for x in row))
        result.append(
            f"\nFinal Team Fitness Score: {best_fit:.2f} | Constraints satisfied: {constraints_met}/{len(self.required_roles)}")
        result.append(f"Number of players selected: {len(best_indices)}")

        # Display ground-specific performance info
        result.append(f"\n--- Ground-Specific Performance for {self.TEAM_HOME_GROUNDS.get(ground_team, 'Unknown Ground')} ---")
        for idx in best_indices:
            player = team_df.loc[idx]
            player_name = player["Name"]

            # Check batting ground performance
            batting_boost = self.get_ground_performance_boost(player_name, team, "batting")
            bowling_boost = self.get_ground_performance_boost(player_name, team, "bowling")

            boost_info = []
            if batting_boost != 1.0:
                boost_info.append(f"Batting: {batting_boost:.3f}x")
            if bowling_boost != 1.0:
                boost_info.append(f"Bowling: {bowling_boost:.3f}x")

            if boost_info:
                print(f"{player_name}: {', '.join(boost_info)}")

        # FIXED: Verify no duplicates
        if len(set(best_indices)) != len(best_indices):
            result.append("WARNING: Duplicate players detected!")
        else:
            result.append("✓ All players are unique")
            
        return result,best_indices

    def get_team_players(self,teamName):
        df = self.df[self.df['Team'] == teamName]
        names = df['Name'].tolist()
        return names
    def dls_injury_prediction(self,team,best_indices1,team_df1,both_selected=False):
        result = []
        for i in self.result:
            if(both_selected):
                print("")
            else:
                result.append(i)
        testing = self.dls_mode_adjustment(best_indices1,team_df1,team)
        print(testing[0])
        print("\n" + "1" if testing[1] else "0" + "\n")
        print(f"\n--- Best XI for {team} ---")
        team_df = team_df1
        self.clear_all_caches()
        if len(team_df) < 12:
            result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
            return result

        # Pass team parameter to genetic algorithm for ground-specific boost
        _, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

        if testing[0] is None:
            result.append("No valid XI found.")
            return result

        # FIXED: Final check for unique players
        best_indices = self.ensure_unique_team(testing[0], team_df)
        best_players = team_df.iloc[best_indices]

        # Check if consistent batter exists (CORRECTED LOGIC)
        consistent_batter_exists = self.check_consistent_batter_exists(best_players)
        print(f"Consistent Batter exists: {consistent_batter_exists}")

        # Apply anchor batter check
        print("\n--- Applying Anchor Batter Check ---")
        best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                    team)

        # Recalculate fitness if replacement was made
        if anchor_replacement_made:
            constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
            best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                    weighted_score, team)

        # Check for bowling specialists
        final_players = team_df.iloc[best_indices]
        death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

        print(f"Death Bowler exists: {death_bowler_exists}")
        print(f"New Ball Specialist exists: {new_ball_exists}")

        # Apply bowling specialist check
        if death_bowler_exists or new_ball_exists:
            print("\n--- Applying Bowling Specialist Check ---")
            best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                            death_bowler_exists, new_ball_exists)

            # Recalculate fitness if replacement was made
            if bowling_replacement_made:
                constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                        weighted_score, team)

        # Final team display
        final_players = team_df.iloc[best_indices]
        print("\n--- Final Team ---")
        selected_df = final_players[["Name", "Player Role"]]
        result.append("Name | Player Role")
        for _, row in selected_df.iterrows():
            result.append(' | '.join(str(x) for x in row))
        result.append(
            f"\nFinal Team Fitness Score: {best_fit:.2f} | Constraints satisfied: {constraints_met}/{len(self.required_roles)}")
        result.append(f"Number of players selected: {len(best_indices)}")

        # Display ground-specific performance info
        result.append(f"\n--- Ground-Specific Performance for {self.TEAM_HOME_GROUNDS.get(team, 'Unknown Ground')} ---")
        for idx in best_indices:
            player = team_df.loc[idx]
            player_name = player["Name"]

            # Check batting ground performance
            batting_boost = self.get_ground_performance_boost(player_name, team, "batting")
            bowling_boost = self.get_ground_performance_boost(player_name, team, "bowling")

            boost_info = []
            if batting_boost != 1.0:
                boost_info.append(f"Batting: {batting_boost:.3f}x")
            if bowling_boost != 1.0:
                boost_info.append(f"Bowling: {bowling_boost:.3f}x")

            if boost_info:
                print(f"{player_name}: {', '.join(boost_info)}")

        # FIXED: Verify no duplicates
        if len(set(best_indices)) != len(best_indices):
            result.append("WARNING: Duplicate players detected!")
        else:
            result.append("✓ All players are unique")
        return result

    def prediction_custom_mode(self,teams,ground_team,injury_enabled,df,players,dls_enabled=False):
        result = []
        for i in self.result:
            result.append(i)
        for team in teams:
            if not injury_enabled and not dls_enabled:
                print(f"\n--- Best XI for {team} ---")
                team_df = df[df["Team"] == team].reset_index(drop=True)

                self.clear_all_caches()
                if len(team_df) < 12:
                    result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                    continue

                # Pass team parameter to genetic algorithm for ground-specific boost
                best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                if best_indices is None:
                    result.append("No valid XI found.")
                    continue

                # FIXED: Final check for unique players
                best_indices = self.ensure_unique_team(best_indices, team_df)
                best_players = team_df.iloc[best_indices]

                # Check if consistent batter exists (CORRECTED LOGIC)
                consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                print(f"Consistent Batter exists: {consistent_batter_exists}")

                # Apply anchor batter check
                print("\n--- Applying Anchor Batter Check ---")
                best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                            team)

                # Recalculate fitness if replacement was made
                if anchor_replacement_made:
                    constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                    best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                            weighted_score, team)

                # Check for bowling specialists
                final_players = team_df.iloc[best_indices]
                death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                print(f"Death Bowler exists: {death_bowler_exists}")
                print(f"New Ball Specialist exists: {new_ball_exists}")

                # Apply bowling specialist check
                if death_bowler_exists or new_ball_exists:
                    print("\n--- Applying Bowling Specialist Check ---")
                    best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                    death_bowler_exists, new_ball_exists)

                    # Recalculate fitness if replacement was made
                    if bowling_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)

                # Final team display
                final_players = team_df.iloc[best_indices]
                print("\n--- Final Team ---")
                selected_df = final_players[["Name", "Player Role", ]]
                result.append("Name | Player Role")
                for _, row in selected_df.iterrows():
                    result.append(' | '.join(str(x) for x in row))
                result.append(
                    f"\nFinal Team Fitness Score: {best_fit:.2f} | Constraints satisfied: {constraints_met}/{len(self.required_roles)}")
                result.append(f"Number of players selected: {len(best_indices)}")

                # Display ground-specific performance info
                result.append(f"\n--- Ground-Specific Performance for {self.TEAM_HOME_GROUNDS.get(ground_team, 'Unknown Ground')} ---")
                for idx in best_indices:
                    player = team_df.loc[idx]
                    player_name = player["Name"]

                    # Check batting ground performance
                    batting_boost = self.get_ground_performance_boost(player_name, team, "batting")
                    bowling_boost = self.get_ground_performance_boost(player_name, team, "bowling")

                    boost_info = []
                    if batting_boost != 1.0:
                        boost_info.append(f"Batting: {batting_boost:.3f}x")
                    if bowling_boost != 1.0:
                        boost_info.append(f"Bowling: {bowling_boost:.3f}x")

                    if boost_info:
                        print(f"{player_name}: {', '.join(boost_info)}")

                # FIXED: Verify no duplicates
                if len(set(best_indices)) != len(best_indices):
                    result.append("WARNING: Duplicate players detected!")
                else:
                    result.append("✓ All players are unique")
            elif injury_enabled and not dls_enabled:
                team_df = df[df["Team"] == team].reset_index(drop=True)
                result,best_indices = self.injury_prediction(team,team_df,injury_enabled,ground_team,players)
            elif dls_enabled and not injury_enabled:
                print(f"\n--- Best XI for {team} ---")
                team_df = df[df["Team"] == team].reset_index(drop=True)
                self.clear_all_caches()
                if len(team_df) < 12:
                    result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                    continue
                # Pass team parameter to genetic algorithm for ground-specific boost
                best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                if best_indices is None:
                    result.append("No valid XI found.")
                    continue

                # FIXED: Final check for unique players
                best_indices = self.ensure_unique_team(best_indices, team_df)
                best_players = team_df.iloc[best_indices]

                # Check if consistent batter exists (CORRECTED LOGIC)
                consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                print(f"Consistent Batter exists: {consistent_batter_exists}")

                # Apply anchor batter check
                print("\n--- Applying Anchor Batter Check ---")
                best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                            team)

                # Recalculate fitness if replacement was made
                if anchor_replacement_made:
                    constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                    best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                            weighted_score, team)

                # Check for bowling specialists
                final_players = team_df.iloc[best_indices]
                death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                print(f"Death Bowler exists: {death_bowler_exists}")
                print(f"New Ball Specialist exists: {new_ball_exists}")

                # Apply bowling specialist check
                if death_bowler_exists or new_ball_exists:
                    print("\n--- Applying Bowling Specialist Check ---")
                    best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                    death_bowler_exists, new_ball_exists)

                    # Recalculate fitness if replacement was made
                    if bowling_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)
                result = self.dls_injury_prediction(team,best_indices,team_df)
            else:
                team_df = df[df["Team"] == team].reset_index(drop=True)
                _,new_team_df,_,goat = self.injury_replacement(team,team_df,injury_enabled,self.present_df,players)
                #for i in goat:
                #    result.append(i)
                print(f"\n--- Best XI for {team} ---")
                team_df = new_team_df
                self.clear_all_caches()
                if len(team_df) < 12:
                    result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                    return result
                # Pass team parameter to genetic algorithm for ground-specific boost
                best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                if best_indices is None:
                    result.append("No valid XI found.")
                    return result

                # FIXED: Final check for unique players
                best_indices = self.ensure_unique_team(best_indices, team_df)
                best_players = team_df.iloc[best_indices]

                # Check if consistent batter exists (CORRECTED LOGIC)
                consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                print(f"Consistent Batter exists: {consistent_batter_exists}")

                # Apply anchor batter check
                print("\n--- Applying Anchor Batter Check ---")
                best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                            team)

                # Recalculate fitness if replacement was made
                if anchor_replacement_made:
                    constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                    best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                            weighted_score, team)

                # Check for bowling specialists
                final_players = team_df.iloc[best_indices]
                death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                print(f"Death Bowler exists: {death_bowler_exists}")
                print(f"New Ball Specialist exists: {new_ball_exists}")

                # Apply bowling specialist check
                if death_bowler_exists or new_ball_exists:
                    print("\n--- Applying Bowling Specialist Check ---")
                    best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                    death_bowler_exists, new_ball_exists)

                    # Recalculate fitness if replacement was made
                    if bowling_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)
                true = self.dls_injury_prediction(team,best_indices,team_df,True)
                for i in true:
                    result.append(i)
        return result,best_indices,team_df

    def predict_team_mode(self,injury_enabled,team_name,dls_enabled,players=None):
        result = []
        for i in self.result:
            result.append(i)
        for team in self.teams:
            if(team_name == team):
                if not injury_enabled and not dls_enabled:
                    print(f"\n--- Best XI for {team} ---")
                    team_df = self.df[self.df["Team"] == team].reset_index(drop=True)

                    self.clear_all_caches()
                    if len(team_df) < 12:
                        result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                        continue

                    # Pass team parameter to genetic algorithm for ground-specific boost
                    best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                    if best_indices is None:
                        result.append("No valid XI found.")
                        continue

                    # FIXED: Final check for unique players
                    best_indices = self.ensure_unique_team(best_indices, team_df)
                    best_players = team_df.iloc[best_indices]

                    # Check if consistent batter exists (CORRECTED LOGIC)
                    consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                    print(f"Consistent Batter exists: {consistent_batter_exists}")

                    # Apply anchor batter check
                    print("\n--- Applying Anchor Batter Check ---")
                    best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                                team)

                    # Recalculate fitness if replacement was made
                    if anchor_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)

                    # Check for bowling specialists
                    final_players = team_df.iloc[best_indices]
                    death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                    print(f"Death Bowler exists: {death_bowler_exists}")
                    print(f"New Ball Specialist exists: {new_ball_exists}")

                    # Apply bowling specialist check
                    if death_bowler_exists or new_ball_exists:
                        print("\n--- Applying Bowling Specialist Check ---")
                        best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                        death_bowler_exists, new_ball_exists)

                        # Recalculate fitness if replacement was made
                        if bowling_replacement_made:
                            constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                            best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                    weighted_score, team)

                    # Final team display
                    final_players = team_df.iloc[best_indices]
                    print("\n--- Final Team ---")
                    selected_df = final_players[["Name", "Player Role"]]
                    result.append("Name | Player Role")
                    for _, row in selected_df.iterrows():
                        result.append(' | '.join(str(x) for x in row))
                    result.append(
                        f"\nFinal Team Fitness Score: {best_fit:.2f} | Constraints satisfied: {constraints_met}/{len(self.required_roles)}")
                    result.append(f"Number of players selected: {len(best_indices)}")

                    # Display ground-specific performance info
                    result.append(f"\n--- Ground-Specific Performance for {self.TEAM_HOME_GROUNDS.get(team, 'Unknown Ground')} ---")
                    for idx in best_indices:
                        player = team_df.loc[idx]
                        player_name = player["Name"]

                        # Check batting ground performance
                        batting_boost = self.get_ground_performance_boost(player_name, team, "batting")
                        bowling_boost = self.get_ground_performance_boost(player_name, team, "bowling")

                        boost_info = []
                        if batting_boost != 1.0:
                            boost_info.append(f"Batting: {batting_boost:.3f}x")
                        if bowling_boost != 1.0:
                            boost_info.append(f"Bowling: {bowling_boost:.3f}x")

                        if boost_info:
                            print(f"{player_name}: {', '.join(boost_info)}")

                    # FIXED: Verify no duplicates
                    if len(set(best_indices)) != len(best_indices):
                        result.append("WARNING: Duplicate players detected!")
                    else:
                        result.append("✓ All players are unique")
                elif injury_enabled and not dls_enabled:
                    team_df = self.df[self.df["Team"] == team].reset_index(drop=True)
                    result,best_indices = self.injury_prediction(team,team_df,injury_enabled,team,players)
                elif dls_enabled and not injury_enabled:
                    print("DLSSSSS")
                    print(f"\n--- Best XI for {team} ---")
                    team_df = self.df[self.df["Team"] == team].reset_index(drop=True)
                    self.clear_all_caches()
                    if len(team_df) < 12:
                        result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                        continue
                    # Pass team parameter to genetic algorithm for ground-specific boost
                    best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                    if best_indices is None:
                        result.append("No valid XI found.")
                        continue

                    # FIXED: Final check for unique players
                    best_indices = self.ensure_unique_team(best_indices, team_df)
                    best_players = team_df.iloc[best_indices]

                    # Check if consistent batter exists (CORRECTED LOGIC)
                    consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                    print(f"Consistent Batter exists: {consistent_batter_exists}")

                    # Apply anchor batter check
                    print("\n--- Applying Anchor Batter Check ---")
                    best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                                team)

                    # Recalculate fitness if replacement was made
                    if anchor_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)

                    # Check for bowling specialists
                    final_players = team_df.iloc[best_indices]
                    death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                    print(f"Death Bowler exists: {death_bowler_exists}")
                    print(f"New Ball Specialist exists: {new_ball_exists}")

                    # Apply bowling specialist check
                    if death_bowler_exists or new_ball_exists:
                        print("\n--- Applying Bowling Specialist Check ---")
                        best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                        death_bowler_exists, new_ball_exists)

                        # Recalculate fitness if replacement was made
                        if bowling_replacement_made:
                            constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                            best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                    weighted_score, team)
                    result = self.dls_injury_prediction(team,best_indices,team_df)
                else:
                    team_df = self.df[self.df["Team"] == team].reset_index(drop=True)
                    _,new_team_df,_,goat = self.injury_replacement(team,team_df,injury_enabled,self.present_df,players)
                    #for i in goat:
                    #    result.append(i)
                    print(f"\n--- Best XI for {team} ---")
                    team_df = new_team_df
                    self.clear_all_caches()
                    if len(team_df) < 12:
                        result.append(f"Not enough players to generate XI. Team has only {len(team_df)} players.")
                        return result
                    # Pass team parameter to genetic algorithm for ground-specific boost
                    best_indices, best_fit, constraints_met = self.adaptive_genetic_algorithm(team_df, team=team)

                    if best_indices is None:
                        result.append("No valid XI found.")
                        return result

                    # FIXED: Final check for unique players
                    best_indices = self.ensure_unique_team(best_indices, team_df)
                    best_players = team_df.iloc[best_indices]

                    # Check if consistent batter exists (CORRECTED LOGIC)
                    consistent_batter_exists = self.check_consistent_batter_exists(best_players)
                    print(f"Consistent Batter exists: {consistent_batter_exists}")

                    # Apply anchor batter check
                    print("\n--- Applying Anchor Batter Check ---")
                    best_indices, anchor_replacement_made = self.anchor_batter_check(best_indices, team_df, consistent_batter_exists,
                                                                                team)

                    # Recalculate fitness if replacement was made
                    if anchor_replacement_made:
                        constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                        best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                weighted_score, team)

                    # Check for bowling specialists
                    final_players = team_df.iloc[best_indices]
                    death_bowler_exists, new_ball_exists = self.check_bowling_specialists_exist(final_players)

                    print(f"Death Bowler exists: {death_bowler_exists}")
                    print(f"New Ball Specialist exists: {new_ball_exists}")

                    # Apply bowling specialist check
                    if death_bowler_exists or new_ball_exists:
                        print("\n--- Applying Bowling Specialist Check ---")
                        best_indices, bowling_replacement_made = self.bowling_specialist_check(best_indices, team_df,
                                                                                        death_bowler_exists, new_ball_exists)

                        # Recalculate fitness if replacement was made
                        if bowling_replacement_made:
                            constraints_met, overseas_valid, weighted_score, _ = self.count_constraints_met(team_df, best_indices)
                            best_fit = self.enhanced_fitness_with_penalties(team_df, best_indices, constraints_met, overseas_valid,
                                                                    weighted_score, team)
                    true = self.dls_injury_prediction(team,best_indices,team_df,True)
                    for i in true:
                        result.append(i)
            else:
                print("No team like " + team_name)
        return result,best_indices,team_df
    
    def ai_prediction(self, prompt):
        response = self.models.generate_content(prompt)
        return (response.text)

    def get_players_list(self,df,best_indices):
        # Adjust column names as per your CSV
        selected = df.iloc[best_indices]
        selected = selected.replace({np.nan: None})
        players = []
        for _, row in selected.iterrows():
            players.append({
                "name": row["Name"],
                "battingStyle": row.get("Batting Style"),
                "bowlingStyle": row.get("Bowling Style"),
                "battingScore": row.get("Overall Batting (Weighted)", 0),
                "bowlingScore": row.get("Overall Bowling (Weighted)", 0)
            })
        print(players)
        return players

    def get_player(self,player_name):
        # Adjust column names as per your CSV
        player = self.dffull[self.dffull["Name"] == player_name].iloc[0]
        player_str = f'{player["Name"]} | {player.get("Batting Style", "N/A")} | {player.get("Bowling Style", "N/A")} | {player.get("Overseas", False)} | {player.get("Overall Batting (Weighted)", 0)} | {player.get("Overall Bowling (Weighted)", 0)} | {player.get("Player Role", "Unknown")}'
        return player_str
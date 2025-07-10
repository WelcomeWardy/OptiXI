
// Injury Optimization State
// (must be inside the component)


import './Home.css';
import './Custom.css';
import './fonts.css';
import '../assets/ipl-theme.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const IPL_TEAMS = [
  { name: 'CSK', logo: '/public/csk.jpg' },
  { name: 'MI', logo: 'public/mi.jpg' },
  { name: 'KKR', logo: 'public/kkr.jpg' },
  { name: 'RCB', logo: 'public/rcb.jpg' },
  { name: 'SRH', logo: 'public/srh.jpg' },
  { name: 'DC', logo: 'public/dc.jpg' },
  { name: 'RR', logo: 'public/rr.jpg' },
  { name: 'LSG', logo: 'public/lsg.jpg' },
  { name: 'GT', logo: 'public/gt.jpg' },
  { name: 'PBKS', logo: 'public/pbks.jpg' },
];

const MOCK_PLAYERS = ['AB de Villiers',
 'Aaron Finch',
 'Aaron Hardie',
 'Aavishkar Salvi',
 'Abdul Basith',
 'Abdul Samad',
 'Abdur Razzak',
 'Abhijeet Tomar',
 'Abhimanyu Mithun',
 'Abhinav Manohar',
 'Abhinav Mukund',
 'Abhishek Jhunjhunwala',
 'Abhishek Nayar',
 'Abhishek Raut',
 'Abhishek Sharma',
 'Abishek Porel',
 'Abrar Kazi',
 'Abu Ahmed',
 'Adam Gilchrist',
 'Adam Milne',
 'Adam Voges',
 'Adam Zampa',
 'Adil Rashid',
 'Aditya Dole',
 'Aditya Tare',
 'Adrian Barath',
 'Aiden Blizzard',
 'Aiden Markram',
 'Ajantha Mendis',
 'Ajay Mandal',
 'Ajinkya Rahane',
 'Ajit Agarkar',
 'Ajit Chandila',
 'Akash Chopra',
 'Akash Deep',
 'Akash Madhwal',
 'Akash Singh',
 'Akeal Hosein',
 'Akila Dananjaya',
 'Akshdeep Nath',
 'Albie Morkel',
 'Alex Carey',
 'Alex Hales',
 'Alfonso Thomas',
 'Ali Murtaza',
 'Alzarri Joseph',
 'Aman Hakim Khan',
 'Ambati Rayudu',
 'Amit Mishra',
 'Amit Paunikar',
 'Amit Singh',
 'Amit Uniyal',
 'Anand Rajan',
 'Andre Nel',
 'Andre Russell',
 'Andre Siddharth',
 'Andrew Flintoff',
 'Andrew McDonald',
 'Andrew Symonds',
 'Andrew Tye',
 'Angelo Mathews',
 'Angkrish Raghuvanshi',
 'Aniket Choudhary',
 'Aniket Verma',
 'Anil Kumble',
 'Anirudh Singh',
 'Ankeet Chavan',
 'Ankit Bawne',
 'Ankit Rajpoot',
 'Ankit Sharma',
 'Ankit Soni',
 'Anmolpreet Singh',
 'Anrich Nortje',
 'Anshul Kamboj',
 'Anuj Rawat',
 'Anukul Roy',
 'Anureet Singh',
 'Anustup Majumdar',
 'Arindam Ghosh',
 'Arjun Tendulkar',
 'Arjun Yadav',
 'Arshad Khan',
 'Arshdeep Singh',
 'Arshin Kulkarni',
 'Arun Karthik',
 'Aryan Juyal',
 'Asad Pathan',
 'Ashish Nehra',
 'Ashish Reddy',
 'Ashley Noffke',
 'Ashok Dinda',
 'Ashok Menaria',
 'Ashton Turner',
 'Ashutosh Sharma',
 'Ashwani Kumar',
 'Atharva Taide',
 'Avesh Khan',
 'Axar Patel',
 'Ayush Badoni',
 'Ayush Mhatre',
 'Azhar Mahmood',
 'Azharuddin Bilakhia',
 'Azmatullah Omarzai',
 'BR Sharath',
 'Baba Indrajith',
 'Balachandra Akhil',
 'Barinder Sran',
 'Basil Thampi',
 'Ben Cutting',
 'Ben Dunk',
 'Ben Hilfenhaus',
 'Ben Laughlin',
 'Ben Rohrer',
 'Ben Stokes',
 'Beuran Hendricks',
 'Bevon Jacobs',
 'Bhanuka Rajapaksa',
 'Bharat Chipli',
 'Bhargav Bhatt',
 'Bhuvneshwar Kumar',
 'Billy Stanlake',
 'Biplab Samantray',
 'Bipul Sharma',
 'Bodapati Sumanth',
 'Brad Haddin',
 'Brad Hogg',
 'Bradley Hodge',
 'Brendon McCullum',
 'Brett Geeves',
 'Brett Lee',
 'CM Gautam',
 'Callum Ferguson',
 'Cameron Green',
 'Cameron White',
 'Carlos Brathwaite',
 'Chamara Kapugedera',
 'Chamara Silva',
 'Chaminda Vaas',
 'Chandan Madan',
 'Chandrasehar Ganapathy',
 'Charl Langeveldt',
 'Chetan Sakariya',
 'Chetanya Nanda',
 'Cheteshwar Pujara',
 'Chris Gayle',
 'Chris Green',
 'Chris Jordan',
 'Chris Lynn',
 'Chris Morris',
 'Chris Woakes',
 'Clinton McKay',
 'Colin Ingram',
 'Colin Munro',
 'Colin de Grandhomme',
 'Corbin Bosch',
 'Corey Anderson',
 'D Vijaykumar',
 "D'Arcy Short",
 'Dale Steyn',
 'Damien Martyn',
 'Dan Christian',
 'Daniel Harris',
 'Daniel Sams',
 'Daniel Vettori',
 'Daren Sammy',
 'Darren Bravo',
 'Darren Lehmann',
 'Darshan Nalkande',
 'Daryl Mitchell',
 'Dasun Shanaka',
 'David Hussey',
 'David Jacobs',
 'David Miller',
 'David Warner',
 'David Wiese',
 'David Willey',
 'Dawid Malan',
 'Debabrata Das',
 'Deepak Chahar',
 'Deepak Hooda',
 'Devdutt Padikkal',
 'Devon Conway',
 'Devraj Patil',
 'Dewald Brevis',
 'Dhawal Kulkarni',
 'Dhrun Shorey',
 'Dhruv Jurel',
 'Digvesh Rathi',
 'Dilhara Fernando',
 'Dillon du Preez',
 'Dimitri Mascarenhas',
 'Dinesh Karthik',
 'Dinesh Salunkhe',
 'Dirk Nannes',
 'Dishant Yagnik',
 'Doddapaneni Kalyankrishna',
 'Dominic Thornely',
 'Domnic Muthuswami',
 'Doug Bollinger',
 'Douglas Bracewell',
 'Duan Jansen',
 'Dushmantha Chameera',
 'Dwaine Pretorius',
 'Dwaraka Ravi Teja',
 'Dwayne Bravo',
 'Dwayne Smith',
 'Eklavya Dwivedi',
 'Eoin Morgan',
 'Eshan Malinga',
 'Evin Lewis',
 'Fabian Allen',
 'Faf du Plessis',
 'Faiz Fazal',
 'Farhaan Behardien',
 'Farveez Maharoof',
 'Fazalhaq Farooqi',
 'Fidel Edwards',
 'Gagandeep Singh',
 'Gautam Gambhir',
 'George Bailey',
 'George Garton',
 'Gerald Coetzee',
 'Glenn Maxwell',
 'Glenn McGrath',
 'Glenn Phillips',
 'Graeme Smith',
 'Graham Napier',
 'Gulbadin Naib',
 'Gurinder Sandhu',
 'Gurjapneet Singh',
 'Gurkeerat Singh Mann',
 'Gurnoor Brar',
 'Halhadar Das',
 'Hanuma Vihari',
 'Harbhajan Singh',
 'Hardik Pandya',
 'Hardus Viljoen',
 'Harmeet Singh',
 'Harnoor Pannu',
 'Harpreet Brar',
 'Harpreet Singh',
 'Harry Brook',
 'Harry Gurney',
 'Harsh Dubey',
 'Harshal Patel',
 'Harshit Rana',
 'Hashim Amla',
 'Heinrich Klaasen',
 'Herschelle Gibbs',
 'Himanshu Sharma',
 'Himmat Singh',
 'Hrithik Shokeen',
 'Imran Tahir',
 'Iqbal Abdulla',
 'Irfan Pathan',
 'Ish Sodhi',
 'Ishan Kishan',
 'Ishan Malhotra',
 'Ishan Porel',
 'Ishank Jaggi',
 'Ishant Sharma',
 'Ishwar Pandey',
 'Isuru Udana',
 'Jacob Bethell',
 'Jacob Oram',
 'Jacques Kallis',
 'Jagadeesh Arunkumar',
 'Jagadeesha Suchith',
 'Jake Fraser McGurk',
 'Jalaj Saxena',
 'Jamaluddin Syed Mohammad',
 'James Faulkner',
 'James Franklin',
 'James Hopes',
 'James Neesham',
 'James Pattinson',
 'Jamie Overton',
 'Jaskaran Singh',
 'Jason Behrendorff',
 'Jason Holder',
 'Jason Roy',
 'Jasprit Bumrah',
 'Javon Scantlebury',
 'Jayant Yadav',
 'Jaydev Unadkat',
 'Jean Paul Duminy',
 'Jeevan Mendis',
 'Jerome Taylor',
 'Jesse Ryder',
 'Jhye Richardson',
 'Jitesh Sharma',
 'Joe Denly',
 'Joe Root',
 'Jofra Archer',
 'Joginder Sharma',
 'Johan Botha',
 'Johannes van der Wath',
 'John Hastings',
 'Jonny Bairstow',
 'Jos Buttler',
 'Josh Hazlewood',
 'Josh Inglis',
 'Josh Little',
 'Josh Philippe',
 'Junior Dala',
 'Justin Kemp',
 'K C Cariappa',
 'K M Asif',
 'KL Rahul',
 'KS Bharat',
 'Kagiso Rabada',
 'Kamindu Mendis',
 'Kamlesh Nagarkoti',
 'Kamran Akmal',
 'Kamran Khan',
 'Kane Richardson',
 'Kane Williamson',
 'Karan Goel',
 'Karan Sharma',
 'Karanveer Singh',
 'Karim Jannat',
 'Karn Sharma',
 'Kartik Tyagi',
 'Karun Nair',
 'Kedar Devdhar',
 'Kedar Jadhav',
 'Keemo Paul',
 'Kemar Roach',
 'Keshav Maharaj',
 'Kevin Pietersen',
 'Kevon Cooper',
 'Khaleel Ahmed',
 'Kieron Pollard',
 'Kotarangada Appanna',
 'Krishmar Santokie',
 'Krishnakant Upadhyay',
 'Krishnappa Gowtham',
 'Krunal Pandya',
 'Kuldeep Sen',
 'Kuldeep Yadav',
 'Kuldip Yadav',
 'Kulwant Khejroliya',
 'Kumar Kartikeya',
 'Kumar Kushagra',
 'Kumar Sangakkara',
 'Kusal Perera',
 'Kwena Maphaka',
 'Kyle Abbott',
 'Kyle Jamieson',
 'Kyle Mayers',
 'Lakshmipathy Balaji',
 'Lalit Yadav',
 'Lasith Malinga',
 'Laxmi Shukla',
 'Lee Carseldine',
 'Lendl Simmons',
 'Liam Livingstone',
 'Liam Plunkett',
 'Litton Das',
 'Lizaad Williams',
 'Lockie Ferguson',
 'Love Ablish',
 'Luke Pommersbach',
 'Luke Ronchi',
 'Luke Wood',
 'Luke Wright',
 'Lukman Meriwala',
 'Lungi Ngidi',
 'Luvnith Sissodia',
 'MS Dhoni',
 'Madhav Tiwari',
 'Maheesh Theekshana',
 'Mahela Jayawardene',
 'Mahesh Rawat',
 'Mahipal Lomror',
 'Makhaya Ntini',
 'Manan Vohra',
 'Manav Suthar',
 'Mandeep Singh',
 'Manimaran Siddharth',
 'Manish Pandey',
 'Manoj Tiwary',
 'Manpreet Gony',
 'Manprit Juneja',
 'Manvanth Kumar',
 'Manvinder Bisla',
 'Marchant de Lange',
 'Marco Jansen',
 'Marcus Stoinis',
 'Mark Boucher',
 'Mark Wood',
 'Marlon Samuels',
 'Martin Guptill',
 'Mashrafe Mortaza',
 'Matheesha Pathirana',
 'Matt Henry',
 'Matthew Hayden',
 'Matthew Short',
 'Matthew Wade',
 'Mayank Agarwal',
 'Mayank Dagar',
 'Mayank Markande',
 'Mayank Yadav',
 'Michael Bracewell',
 'Michael Clarke',
 'Michael Hussey',
 'Michael Klinger',
 'Michael Lumb',
 'Michael Neser',
 'Misbah ul Haq',
 'Mitch Owen',
 'Mitchell Johnson',
 'Mitchell Marsh',
 'Mitchell McClenaghan',
 'Mitchell Santner',
 'Mitchell Starc',
 'Mithun Manhas',
 'Moeen Ali',
 'Mohammad Ashraful',
 'Mohammad Asif',
 'Mohammad Hafeez',
 'Mohammad Kaif',
 'Mohammad Nabi',
 'Mohammed Shami',
 'Mohammed Siraj',
 'Mohit Rathee',
 'Mohit Sharma',
 'Mohnish Mishra',
 'Mohnish Parmar',
 'Mohsin Khan',
 'Moises Henriques',
 'Monu Kumar',
 'Morne Morkel',
 'Morne van Wyk',
 'Mujeeb Ur Rahman',
 'Mukesh Choudhary',
 'Mukesh Kumar',
 'Munaf Patel',
 'Murali Kartik',
 'Murali Vijay',
 'Murugan Ashwin',
 'Musavir Khote',
 'Musheer Khan',
 'Mustafizur Rahman',
 'Muttiah Muralitharan',
 'Naman Dhir',
 'Naman Ojha',
 'Nandre Burger',
 'Narayan Jagadeesan',
 'Nathan Coulter Nile',
 'Nathan Ellis',
 'Nathan McCullum',
 'Nathan Rimmington',
 'Nathu Singh',
 'Navdeep Saini',
 'Naveen-ul-Haq',
 'Nayan Doshi',
 'Nehal Wadhera',
 'Nicholas Pooran',
 'Nicolas Maddinson',
 'Nikhil Naik',
 'Niraj Patel',
 'Nishanth Sindhu',
 'Nitin Saini',
 'Nitish Rana',
 'Nitish Reddy',
 'Noor Ahmad',
 'Nuwan Kulasekara',
 'Nuwan Thushara',
 'Nuwan Zoysa',
 'Obed McCoy',
 'Odean Smith',
 'Oshane Thomas',
 'Owais Shah',
 'P Reddy',
 'P Sarvesh Kumar',
 'Padmanablhan Prasanth',
 'Palani Amarnath',
 'Pankaj Dharmani',
 'Pankaj Singh',
 'Paras Dogra',
 'Pardeep Sahu',
 'Parthiv Patel',
 'Parvez Rasool',
 'Parvinder Awana',
 'Pat Cummins',
 'Paul Collingwood',
 'Paul Valthaty',
 'Pawan Negi',
 'Pawan Suyal',
 'Peter Handscomb',
 'Phil Salt',
 'Pinal Shah',
 'Piyush Chawla',
 'Prabhsimran Singh',
 'Pradeep Sangwan',
 'Pragyan Ojha',
 'Prasanth Parameswaran',
 'Prashant Chopra',
 'Prashant Solanki',
 'Prasidh Krishna',
 'Praveen Kumar',
 'Pravin Dubey',
 'Pravin Tambe',
 'Prayas Ray Barman',
 'Prerak Mankad',
 'Prince Yadav',
 'Prithvi Shaw',
 'Priyam Garg',
 'Priyansh Arya',
 'Pyla Avinash',
 'Quinton de Kock',
 'R P Singh',
 'Rachin Ravindra',
 'Raghav Goyal',
 'Rahil Shaikh',
 'Rahmanullah Gurbaz',
 'Rahul Chahar',
 'Rahul Dravid',
 'Rahul Sharma',
 'Rahul Shukla',
 'Rahul Tewatia',
 'Rahul Tripathi',
 'Raiphi Gomez',
 'Raj Bawa',
 'Rajagopal Sathish',
 'Rajat Bhatia',
 'Rajat Patidar',
 'Rajesh Bishnoi',
 'Rajesh Pawar',
 'Raju Bhatkal',
 'Rajvardhan Hangargekar',
 'Ramakrishna Ghosh',
 'Ramandeep Singh',
 'Ramesh Powar',
 'Ramnaresh Sarwan',
 'Ranadeb Bose',
 'Rashid Khan',
 'Rasikh Salam',
 'Rassie van der Dussen',
 'Ravi Bishnoi',
 'Ravi Bopara',
 'Ravi Rampaul',
 'Ravichandran Ashwin',
 'Ravindra Jadeja',
 'Ray Price',
 'Reece Topley',
 'Reetinder Sodhi',
 'Richard Gleeson',
 'Richard Levi',
 'Ricky Bhui',
 'Ricky Ponting',
 'Rilee Rossouw',
 'Riley Meredith',
 'Rinku Singh',
 'Ripal Patel',
 'Rishabh Pant',
 'Rishi Dhawan',
 'Riyan Parag',
 'Rob Quiney',
 'Robin Minz',
 'Robin Peterson',
 'Robin Uthappa',
 'Roelof van der Merwe',
 'Rohan Gavaskar',
 'Rohan Raje',
 'Rohit Sharma',
 'Romario Shepherd',
 'Ronit More',
 'Ross Taylor',
 'Rovman Powell',
 'Rusty Theron',
 'Ruturaj Gaikwad',
 'Ryan Harris',
 'Ryan McLaren',
 'Ryan Ninan',
 'Ryan Rickelton',
 'Ryan ten Doeschate',
 'Sachin Baby',
 'Sachin Rana',
 'Sachin Tendulkar',
 'Sachithra Senanayake',
 'Sai Kishore',
 'Sai Sudharsan',
 'Salman Butt',
 'Sam Billings',
 'Sam Curran',
 'Sameer Rizvi',
 'Samuel Badree',
 'Sanath Jayasuriya',
 'Sandeep Lamichhane',
 'Sandeep Sharma',
 'Sandeep Warrier',
 'Sanjay Bangar',
 'Sanjay Yadav',
 'Sanju Samson',
 'Sanvir Singh',
 'Sarabjit Ladda',
 'Sarfaraz Khan',
 'Satyanarayana Raju',
 'Saurabh Tiwary',
 'Saurav Chauhan',
 'Scott Boland',
 'Scott Kuggeleijn',
 'Scott Styris',
 'Sean Abbott',
 'Sediqullah Atal',
 'Shadab Jakati',
 'Shahbaz Ahmed',
 'Shahbaz Nadeem',
 'Shahid Afridi',
 'Shahrukh Khan',
 'Shai Hope',
 'Shaik Rasheed',
 'Shakib Al Hasan',
 'Shalabh Srivastava',
 'Shamar Joseph',
 'Shams Mulani',
 'Shane Bond',
 'Shane Harwood',
 'Shane Warne',
 'Shane Watson',
 'Shardul Thakur',
 'Shashank Singh',
 'Shaun Marsh',
 'Shaun Pollock',
 'Shaun Tait',
 'Sheldon Cottrell',
 'Sheldon Jackson',
 'Sherfane Rutherford',
 'Shikhar Dhawan',
 'Shimron Hetmyer',
 'Shivam Dube',
 'Shivam Mavi',
 'Shivam Sharma',
 'Shivam Singh',
 'Shivil Kaushik',
 'Shivnarine Chanderpaul',
 'Shoaib Ahmed',
 'Shoaib Akhtar',
 'Shoaib Malik',
 'Shoaib Shaikh',
 'Shreevats Goswami',
 'Shreyas Gopal',
 'Shreyas Iyer',
 'Shrijith krishnan',
 'Shrikant Mundhe',
 'Shrikant Wagh',
 'Shubham Agarwal',
 'Shubham Dubey',
 'Shubman Gill',
 'Siddarth Kaul',
 'Siddharth Chitnis',
 'Siddharth Trivedi',
 'Siddhesh Lad',
 'Sikandar Raza',
 'Simarjeet Singh',
 'Simon Katich',
 'Sisanda Magala',
 'Sivaramakrishnan Vidyut',
 'Sohail Tanvir',
 'Sourav Ganguly',
 'Sourav Sarkar',
 'Spencer Johnson',
 'Sreenath Aravind',
 'Sreesanth',
 'Sridharan Sriram',
 'Srikkanth Anirudha',
 'Stephen Fleming',
 'Steve Smith',
 'Stuart Binny',
 'Subramaniam Badrinath',
 'Sudeep Tyagi',
 'Sudhesan Midhun',
 'Sumit Kumar',
 'Sumit Narwal',
 'Sunil Joshi',
 'Sunil Narine',
 'Sunny Gupta',
 'Sunny Singh',
 'Sunny Sohal',
 'Suraj Randiv',
 'Suresh Raina',
 'Suryakumar Yadav',
 'Suryansh Shedge',
 'Suyash Prabhudessai',
 'Suyash Sharma',
 'Swapnil Asnodkar',
 'Swapnil Singh',
 'Swastik Chikara',
 'Tabraiz Shamsi',
 'Taduri Sudhindra',
 'Tanmay Mishra',
 'Tanmay Srivastava',
 'Tanush Kotian',
 'Taruwar Kohli',
 'Tatenda Taibu',
 'Tejas Baroka',
 'Thangarasu Natarajan',
 'Thilan Thushara',
 'Thisara Perera',
 'Tilak Varma',
 'Tillakaratne Dilshan',
 'Tim David',
 'Tim Paine',
 'Tim Seifert',
 'Tim Southee',
 'Tirumalasetti Suman',
 'Tom Banton',
 'Tom Curran',
 'Tom Kohler',
 'Travis Birt',
 'Travis Head',
 'Trent Boult',
 'Tripurana Vijay',
 'Tristan Stubbs',
 'Tushar Deshpande',
 'Tymal Mills',
 'Tyron Henderson',
 'Uday Kaul',
 'Udit Birla',
 'Umar Gul',
 'Umesh Yadav',
 'Umran Malik',
 'Unmukt Chand',
 'Urvil Patel',
 'Usman Khawaja',
 'V V S Laxman',
 'Vaibhav Arora',
 'Vaibhav Suryavanshi',
 'Vansh Bedi',
 'Varun Aaron',
 'Varun Chakravarthy',
 'Veer Pratap Singh',
 'Venkatesh Iyer',
 'Vidwath Kaverappa',
 'Vignesh Puthur',
 'Vijay Shankar',
 'Vijay Zol',
 'Vijayakanth Viyaskanth',
 'Vijaykumar Mahesh',
 'Vijaykumar Vyshak',
 'Vikram Singh',
 'Vikramjeet Malik',
 'Vikrant Yeligati',
 'Vinay Kumar',
 'Vipraj Nigam',
 'Virat Kohli',
 'Virat Singh',
 'Virender Sehwag',
 'Vishnu Vinod',
 'Vivrant Sharma',
 'Wanindu Hasaranga de Silva',
 'Washington Sundar',
 'Wasim Jaffer',
 'Wayne Parnell',
 'Wiaan Mulder',
 'Wilkin Mota',
 'Will Jacks',
 "William O'Rourke",
 'Wriddhiman Saha',
 'X Sargunam',
 'Xavier Bartlett',
 'Yalaka Gnaneswara Rao',
 'Yalaka Venugopal Rao',
 'Yarra Prithvi Raj',
 'Yash Dayal',
 'Yash Dhull',
 'Yash Thakur',
 'Yashasvi Jaiswal',
 'Yashpal Singh',
 'Yogesh Nagar',
 'Yogesh Takawale',
 'Younis Khan',
 'Yudhvir Singh',
 'Yusuf Abdulla',
 'Yusuf Pathan',
 'Yuvraj Chaudhary',
 'Yuvraj Singh',
 'Yuzvendra Chahal',
 'Zaheer Khan',
 'Zeeshan Ansari'];


const Custom = () => {
  const [injuryOptimizationActive, setInjuryOptimizationActive] = useState(false);
  const [injuredPlayers, setInjuredPlayers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dlsMode, setDlsMode] = useState(false);
  const [injuryOpt, setInjuryOpt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const filteredPlayers = search
    ? MOCK_PLAYERS.filter((p) => p.toLowerCase().includes(search.toLowerCase()) && !selectedPlayers.includes(p))
    : [];

  const handleAddPlayer = (player: string) => {
    if (selectedPlayers.includes(player)) {
      setError('Player already selected!');
      setTimeout(() => setError(null), 1200);
      return;
    }
    setSelectedPlayers((prev) => [...prev, player]);
    setSearch('');
    setError(null);
  };

  // Edge case: auto-disable injury or DLS mode if all players are checked/removed
  useEffect(() => {
    if (injuryOptimizationActive && selectedPlayers.length === 0 && injuredPlayers.length > 0) {
      setInjuryOptimizationActive(false);
      setInjuryOpt(false);
      setInjuredPlayers([]);
    }
    if (dlsMode && selectedPlayers.length === 0) {
      setDlsMode(false);
    }
  }, [selectedPlayers, injuryOptimizationActive, injuredPlayers, dlsMode]);

  const handleRemovePlayer = (player: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p !== player));
  };

  const handleClearPlayers = () => {
    setSelectedPlayers([]);
    setInjuredPlayers([]);
  };

  // Dropdown logic for Injury Optimization
  const handleDropdownSelect = (option: string) => {
    if (option === "Injury Optimization") {
      setInjuryOptimizationActive(true);
    } else {
      setInjuryOptimizationActive(false);
      setInjuredPlayers([]); // Clear injured players when mode is off
    }
  };


  // Model generation function
  async function generateModel({ players, team, modes }: { players: string[]; team: string; modes: string[] }) {
    // Simulate async work
    await new Promise((res) => setTimeout(res, 600));
    // Replace with your actual model logic
    return { players, team, modes };
  }

  // Dropdown close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleGenerate = async () => {
    if (!selectedTeam || selectedPlayers.length === 0) {
      setError('Select a team and at least one player!');
      setTimeout(() => setError(null), 1500);
      return;
    }
    setLoading(true);
    setIsGenerating(true);
    const selectedModes: string[] = [];
    if (dlsMode) selectedModes.push('DLS Mode');
    if (injuryOpt) selectedModes.push('Injury Optimization');
    await generateTeam();
    setLoading(false);
    setIsGenerating(false);
    setDropdownOpen(false);
    navigate('/output', { state: { source: 'custom' } });
  };

  async function generateTeam() {
    const selectedModes: string[] = [];
    if (dlsMode) selectedModes.push('DLS Mode');
    if (injuryOpt) selectedModes.push('Injury Optimization');
    console.log(selectedPlayers)
    console.log(injuredPlayers)
    await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({players: selectedPlayers, injuredplayers : injuredPlayers , team: selectedTeam, modes: selectedModes} )
    })
  }

  return (
    <div className="home">
      <div className="home-bg-graphics">
        <div className="ball ball1"></div>
        <div className="ball ball2"></div>
        <div className="ball ball3"></div>
        <div className="ball ball4"></div>
        <div className="ball ball5"></div>
      </div>
      <div className="custom-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '1.5rem' }}>
        {/* Left: Search, Teams */}
        <div className="custom-left flex flex-col gap-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="custom-title text-3xl font-bold mb-2 mt-2" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              Custom Mode
              <div className="hint-container">
                <span
                  className="icon"
                  style={{
                    background: 'rgba(255,214,0,0.13)',
                    color: '#ffd600',
                    fontSize: '1.35rem',
                    borderRadius: '50%',
                    padding: '0.18rem 0.7rem',
                    fontWeight: 700,
                    marginLeft: '0.2rem',
                    cursor: 'help',
                    border: '1px solid #ffd60055',
                    boxShadow: '0 1px 4px #ffd60022',
                    lineHeight: 1,
                    width: '2rem',
                    height: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  tabIndex={0}
                  aria-label="Show hint about Custom Mode"
                >
                  ?
                </span>
                <p className="hint-paragraph">
                  In Custom Mode, you have full control over your team selection. Choose your own players and assign them to a franchise of your choice. This selected franchise will be treated as your home team, enabling the model to factor in home-ground advantages and conditions intelligently during simulation. Custom Mode is perfect for tailoring scenarios, testing strategies, or building your dream lineup under real-world constraints.
                </p>
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative mb-2">
            <input
              className="custom-search-bar"
              type="text"
              placeholder="🔍 Search for players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredPlayers.length > 0) {
                  handleAddPlayer(filteredPlayers[0]);
                }
              }}
            // Removed left padding since the icon is gone
            />
            {error && (
              <div className="text-red-600 font-medium text-base mt-2">{error}</div>
            )}
            {filteredPlayers.length > 0 && (
              <div className="player-dropdown absolute z-20 mt-2 w-full bg-white border border-blue-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                {filteredPlayers.map((player) => (
                  <div
                    key={player}
                    className="player-dropdown-item flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-blue-50 transition"
                    onClick={() => handleAddPlayer(player)}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <span className="text-gray-800 text-base">{player}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Teams Grid */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="team-grid-title pick-home-title" style={{ fontSize: '2rem', fontWeight: 700, color: '#111', marginBottom: '0.7rem', letterSpacing: '0.01em', paddingLeft: '1.2rem', width: '100%', textAlign: 'left', lineHeight: 1.2 }}>
              Pick Your Home Franchise
            </div>
            <div
              className="teams-grid flex overflow-x-auto space-x-4 snap-x snap-mandatory px-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {IPL_TEAMS.map((team) => (
                <button
                  key={team.name}
                  className={`team-box${selectedTeam === team.name ? ' selected' : ''} snap-start`}
                  onClick={() => setSelectedTeam(team.name)}
                  type="button"
                  aria-pressed={selectedTeam === team.name}
                >
                  <span className="team-logo">
                    {team.logo ? <img src={team.logo} alt={team.name + ' logo'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : team.name}
                  </span>
                  <span className="team-name">{team.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="custom-right">
          <div className="selected-players-box" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '18px', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', minHeight: 180, maxHeight: 320, overflowY: 'auto', padding: '1.2rem 1.2rem 1.2rem 1.2rem', marginBottom: '1rem' }}>
            <div className="selected-players-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
              <span>Selected Players</span>
              {selectedPlayers.length > 0 && (
                <button className="clear-btn" onClick={handleClearPlayers} title="Clear all">Clear All</button>
              )}
            </div>
            {selectedPlayers.length === 0 && (
              <div style={{
                color: '#7ba2d6',
                fontSize: '1.08rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.2rem 0 0.7rem 0',
                minHeight: 70,
                fontWeight: 500
              }}>
                <span style={{ fontSize: '2rem', marginBottom: 4 }}>🏏</span>
                <span style={{ textAlign: 'center', lineHeight: 1.4 }}>
                  <b>⚠️ No players selected.</b><br />
                  Start building your squad by choosing your franchise and players from the left.
                </span>
              </div>
            )}
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: 0, margin: 0, listStyle: 'none' }}>
              {selectedPlayers.map((player) => (
                <li key={player} className="selected-player-container" style={{ background: '#e6f0ff', borderRadius: '999px', padding: '0.35rem 0.9rem 0.35rem 0.7rem', fontSize: '1rem', color: '#1a237e', boxShadow: '0 1px 4px 0 rgba(44, 62, 80, 0.07)' }}>
                  {injuryOptimizationActive && (
                    <input
                      type="checkbox"
                      className="injury-checkbox"
                      onChange={() => {
                        const newSelected = selectedPlayers.filter((p) => p !== player);
                        const newInjured = [...injuredPlayers, player];
                        setInjuredPlayers(newInjured);
                        // Edge case: if all selected players are now injured, auto-disable injury optimization
                        if (newSelected.length === 0) {
                          setInjuryOptimizationActive(false);
                          setInjuryOpt(false);
                          setInjuredPlayers([]);
                        }
                        // Edge case: if DLS mode and all players are removed, auto-disable DLS
                        if (dlsMode && newSelected.length === 0) {
                          setDlsMode(false);
                        }
                      }}
                    />
                  )}
                  <span style={{ marginRight: 8 }}>{player}</span>
                  <button onClick={() => handleRemovePlayer(player)} title="Remove" style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: '1.1rem', marginLeft: 2, cursor: 'pointer', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#e3e3e3')}
                    onMouseOut={e => (e.currentTarget.style.background = 'none')}
                  >×</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="generate-section" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }} ref={dropdownRef}>
              <div
                className={`generate-btn${dropdownOpen ? ' open' : ''}`}
                style={{
                  paddingRight: '3.5rem',
                  position: 'relative',
                  width: '380px',
                  minWidth: '260px',
                  maxWidth: '100%',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  border: (!selectedTeam || selectedPlayers.length === 0)
                    ? '2px solid #7ba2d6'
                    : 'none',
                  borderRadius: '2.2rem',
                  boxShadow: (!selectedTeam || selectedPlayers.length === 0) ? 'none' : '0 4px 24px 0 rgba(33, 150, 243, 0.18)',
                  background: (!selectedTeam || selectedPlayers.length === 0)
                    ? 'linear-gradient(90deg, #f0f6fc 0%, #e3eaf3 100%)'
                    : 'linear-gradient(90deg, #1976d2 0%, #ffd600 100%)',
                  color: (!selectedTeam || selectedPlayers.length === 0) ? '#7ba2d6' : '#1a237e',
                  cursor: (!selectedTeam || selectedPlayers.length === 0 || loading) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                  marginBottom: '0.5rem',
                  outline: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <button
                  type="button"
                  disabled={!selectedTeam || selectedPlayers.length === 0 || loading || isGenerating}
                  onClick={handleGenerate}
                  aria-label="Generate"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    cursor: (!selectedTeam || selectedPlayers.length === 0 || loading || isGenerating) ? 'not-allowed' : 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isGenerating && (
                    <svg className="animate-spin" style={{ height: 20, width: 20, color: '#2E90FA', marginRight: 6 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
                <button
                  type="button"
                  className="down-arrow flex items-center justify-center bg-transparent border-0 p-0 m-0 focus:outline-none"
                  style={{
                    fontSize: '1.7rem',
                    color: dropdownOpen
                      ? '#1976d2'
                      : (!selectedTeam || selectedPlayers.length === 0 ? '#4f8cff' : '#1a237e'),
                    textShadow: (!selectedTeam || selectedPlayers.length === 0)
                      ? '0 1px 2px #e3eaf3'
                      : '0 1px 2px #ffd60044',
                    cursor: (!selectedTeam || selectedPlayers.length === 0) ? 'not-allowed' : 'pointer',
                    background: 'none',
                    outline: 'none',
                    transition: 'color 0.2s, text-shadow 0.2s',
                    zIndex: 20,
                  }}
                  tabIndex={(!selectedTeam || selectedPlayers.length === 0) ? -1 : 0}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-label="Show generate options"
                  disabled={!selectedTeam || selectedPlayers.length === 0 || loading}
                  onClick={e => {
                    e.stopPropagation();
                    if (!selectedTeam || selectedPlayers.length === 0 || loading) return;
                    setDropdownOpen(open => !open);
                  }}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ' ') && !(!selectedTeam || selectedPlayers.length === 0 || loading)) {
                      e.preventDefault();
                      setDropdownOpen(open => !open);
                    }
                  }}
                >
                  <span style={{ display: 'inline-block', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {dropdownOpen && (
                  <div
                    className="dropdown-options smaller-dropdown rounded-lg shadow-md bg-white border border-gray-200 py-2 absolute z-10"
                    style={{ minWidth: 0, width: 180, right: 0, left: 'auto', top: '100%', marginTop: 4 }}
                    role="menu"
                  >
                    <button
                      className={`dropdown-option-btn w-full text-left px-4 py-2 rounded-md transition ${dlsMode ? 'bg-blue-100 font-semibold' : 'hover:bg-yellow-100'}`}
                      style={{ fontSize: '1rem', marginBottom: 2 }}
                      onClick={() => setDlsMode((v) => !v)}
                      type="button"
                      tabIndex={0}
                    >
                      DLS Mode {dlsMode && '✓'}
                    </button>
                    <button
                      className={`dropdown-option-btn w-full text-left px-4 py-2 rounded-md transition ${injuryOpt ? 'bg-blue-100 font-semibold' : 'hover:bg-yellow-100'}`}
                      style={{ fontSize: '1rem', marginBottom: 2 }}
                      onClick={() => {
                        setInjuryOpt((v) => {
                          handleDropdownSelect(!v ? "Injury Optimization" : "Other");
                          return !v;
                        });
                      }}
                      type="button"
                      tabIndex={0}
                    >
                      Injury Optimization {injuryOpt && '✓'}
                    </button>
                    {/* Generate button removed from dropdown as requested */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;
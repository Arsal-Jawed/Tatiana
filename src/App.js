import React from "react";
import Form from "./Form";
import Data from "./Data";
import Product from "./Product";
import Loading from './Loading';
import { useState } from "react";
import { Routes,Route } from "react-router-dom";

function App(){
  
  const [profiler,setProfiler] = useState({
    CompanyName: 'HOWMET AEROSPACE (FASTENING SYSTEMS SEGMENT)',
    CompanyDetail: 'Production of Fasteners for aerospace, commercial transportations, and industrial verticals',
    logo:'./logo.png',
    Description: 'Howmet Aerospace (NYSE: HWM) engineers and manufactures multi-material products, including nickel, titanium, aluminum, and cobalt, that are used worldwide in the aerospace (commercial and defense), commercial transportation, and industrial and other markets. The Company operates across four reporting segments: Fastening Systems, Engine Products, Engineered Structures, and Forged Wheels. In Q3 2023, HWM derived % of its revenue from products sold to the commercial aerospace markets (Link to Company Website)',
    Founded: '1888',
    HQ: 'Pitsburg, PA',
    Employees: '21,400',
    Segments: ['Produces aerospace fastening systems and commercial transportation, industrial, and other fasteners such as fasteners, latches, bearings, fluid fittings, and installation tools',
      'The business multi-material fastening systems are found nose to tail on commercial and military aircraft',
      'The business multi-material fastening systems are found nose to tail on commercial and military aircraft'
    ],

    leaders: [
      {
        name: "Barood Khan",
        position: "Chairman & CEO",
        image: "./i3.jpg",
        description: [
          "John has been Chairman of the Board since 2017 and a Director since 2016",
          "He has served as CEO of Howmet and its predecessor company, Arconic Inc., since 2019",
          "Previously, he held roles at TRW Automotive Holdings Corporation, TRW, Inc., and LucasVarity Automotive"
        ]
      },
      {
        name: "Bandook Khan",
        position: "CTO",
        image: "./i1.jpg",
        description: [
          "Alice has been leading the technology department since 2018.",
          "He has a strong background in software engineering and innovation.",
          "Previously, He worked at Google and Microsoft as a senior engineer."
        ]
      },
      {
        name: "Yameen Khan",
        position: "CFO",
        image: "./i4.png",
        description: [
          "Charlie is responsible for the financial operations of the company.",
          "He has extensive experience in finance and accounting.",
          "Previously, he served as CFO at several Fortune 500 companies."
        ]
      }
    ],

    tableData: [
      {millions:'Commercial Aerospace',fy:'20',q1:'3',q2:'5',q3:'9'},
      {millions:'Defense Aerospace',fy:'20',q1:'3',q2:'5',q3:'9'},
      {millions:'comm Transportation',fy:'20',q1:'3',q2:'5',q3:'9'},
      {millions:'Industrial & Others',fy:'20',q1:'3',q2:'5',q3:'9'},
      {millions:'Total Revenue',fy:'20',q1:'3',q2:'5',q3:'9'}
]
  });

  const [prd,setPrd] = useState({
     CompanyName:'STANLEY BLACK & DECKER',
     CompanyDetail: 'Fasteners Business',
     Description: 'The Companys Industrial Segment is comprised of the Engineered Fastening and Infrastructure businesses. The Engineered Fastening business primarily sells highly engineered components such as fasteners, fittings and various engineered products, which are designed for specific application across multiple verticals. The product lines include externally threaded fasteners, blind rivets and tools, blind inserts and tools, drawn arc weld studs and systems, engineered plastic and mechanical fasteners, among others. The Infrastructure Business sells hydraulic tools and high quality, performance-driven heavy equipment attachment tools for off-highway applications.',
     MA: 'The Company completed the acquisition of Consolidated Aerospace Manufacturing, LLC ("CAM") in February 2020 for $1.4B.The CAM acquisition has further diversified the Companys presence in the industrial markets and expanded its portfolio of specialty fasteners in the aerospace and defense markets.',
     logo:'',
     highlights: ['90% of cars and light trucks in Europe and North America use Stanley Engineered Fasteners',
      '23 billion fasteners are produced each year and 1000+ new patents issued annually'
     ],
     RevenueTable: [
      {millions:'Engineered Fastening', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'Infrastructure', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'Total Segment Revenue', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'%Growth', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'Segment Profit', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'%Margin', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'Capital Expenditures', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'% of Revenue', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'Segment Assets', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
      {millions:'% of Total Assets', y1:'$1,717.8',y2:'$1,842.1',y3:'$1,874.5'},
],
    ProductsData: [
      {item:'Critical Application Fasteners', discp:'Cold-formed, hot-forged, precision CNC, and other custom-machined fasteners forcritical applications in multiple industries', itemImage:'./tool.png'},
      {item:'Inserts', discp:'Our inserts provide legendary performance through groundbreaking innovative designs Lockbolts', itemImage:'./tool.png'},
      {item:'Lockbolts', discp:'Our proprietary two-piece lockbolt systems are structural vibration-resistant fasteners with high clamp-loadperformance and multi-grip capabilities Metal Clips', itemImage:'./tool.png'},
      {item:'Metal Clips', discp:'Ergonomic, economic, and efficient, our diverse metal clip portfolio can improve your assembly time and yield costreductions', itemImage:'./tool.png'},
      {item:'Nuts and Nuts Assemblies', discp:'Find torque nuts to weld nuts to clinch nuts that meet a variety of performance specifications for a wide range of industries', itemImage:'./tool.png'},
      {item:'Pins', discp:'Our pin capability ranges from cold-form to CNC and auto-lathe for special configurations', itemImage:'./tool.png'},
      {item:'Plastic Components', discp:'Durable, high-strength plastic fasteners for use in industrial manufacturing and automotive industries', itemImage:'./tool.png'},
      {item:'Rivet Nuts', discp:'Available in round, hex, and square body styles, our rivet nuts feature a variety of options and locking features', itemImage:'./tool.png'},
      {item:'Rivets', discp:'Our blind fasteners and breakstem systems build more structurally sound products', itemImage:'./tool.png'},
      {item:'Screws and Bolts', discp:'Screws and bolts are designed and manufactured to deliver optimum performance, quality, and assembly costs', itemImage:'./tool.png'},
      {item:'Sealing Fasteners', discp:'Solve a tricky problem like maintaining a liquid-tight seal in high and low-pressure applications with sealing fasteners', itemImage:'./tool.png'},
      {item:'Self-Piercing Rivets', discp:'Join two or more layers of material without the need for a predrilled hole with a self- piercing rivet', itemImage:'./tool.png'},
      {item:'Standoffs Spacers and Washers', discp:'Offered in a range of materials to protect against chaffing, shear loads, and galvanic corrosion', itemImage:'./tool.png'},
      {item:'Studs', discp:'Stud fastening options to meet the most demanding application requirements, designed to be installed with equipment to optimize manufacturing efficiency', itemImage:'./tool.png'}
    ]
      
  });

  return(<div>
                <Routes>
                  <Route path='/' element={<Form/>}/>
                  <Route path='/data' element={<Data data={profiler}/>}/>
                  <Route path='/product' element={<Product data={prd}/>}/>
                  <Route path="/loading" element={<Loading/>}/>
                </Routes>
  </div>);
}

export default App;
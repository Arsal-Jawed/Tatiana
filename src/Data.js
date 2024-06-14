import "./data.css";
import Leader from "./Leader";
import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./apiUrl";

function Data({ data }) {
  const [logo, setLogo] = useState(data.logo || null);
  const [images, setImages] = useState(data.leaders.map(() => null));
  const [scrappedData, setScrappedData] = useState([]); 
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const recievedData = location.state?.data || {};

  const handleLogoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleImageChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(event.target.files[0]);
      setImages(newImages);
    }
  };
  const downloadAsPdf = () => {
    const element = document.getElementById("divToDownload");

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Company.pdf");
    });
  };
  
  useEffect(() => {
    console.log("Received data:", recievedData);
    if(recievedData) {
      const data = {
        name: recievedData?.companyOverview['Company Owner'],
        tagline: recievedData?.companyOverview['Company Tagline'],
        description: recievedData?.companyOverview['Description'],
        foundedYear: recievedData?.companyOverview['Founded'],
        headQuaters: recievedData?.companyOverview['HeadQuaters'],
        employees: recievedData?.companyOverview['No. of Employees'],
        founded: recievedData?.companyOverview['Founded'],
        founded: recievedData?.companyOverview['Founded'],
        financialOverview: recievedData?.financialOverview,
        services: recievedData?.services['SERVICES'] || recievedData?.services['SERVICE'],
        leadershipOverview: '',
        profileImg: '',
      }
      setScrappedData(data);
    }
  }, [recievedData]);

  useEffect(() => {
    const asyncResponse = async () => {
      try {
        console.log('loading apis...');
        const res = await Promise.all([axios.post(apiUrl+"financial_overview", recievedData?.inputs, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        axios.post(apiUrl+"leadership_overview", recievedData?.inputs, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        ]);
        console.log('response from /data apis: ', res);
        let financialOverview = splitExtraText(res[0].data);
        financialOverview = financialOverview.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        // let financialOverview = res[0].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        financialOverview = JSON.parse(financialOverview);
        // let marketSegmentation = res[1].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        // marketSegmentation = JSON.parse(marketSegmentation);
        let leadershipOverview = res[1].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        leadershipOverview = JSON.parse(leadershipOverview);
        leadershipOverview = restructureJobPositions(leadershipOverview);
        setScrappedData(prev => ({...prev, financialOverview: financialOverview, leadershipOverview: leadershipOverview}));
        setLoading(false);
      } catch(e) {
        console.log('error in data api: ', e.message || e);
        setLoading(false);
      }
    }
    if(recievedData?.inputs) {
      console.log('inputs: ', recievedData?.inputs);
      asyncResponse();
    }
  }, [])

  function splitExtraText(inputString) {
    // Find the last occurrence of the triple backticks
    const lastTripleBackticksIndex = inputString.lastIndexOf("```");
    
    // If the triple backticks are not found, return the original string
    if (lastTripleBackticksIndex === -1) {
        return inputString;
    }
    
    // Return the substring from the start of the string up to the triple backticks
    return inputString.substring(0, lastTripleBackticksIndex + 3).trim();
  }

  function restructureJobPositions(input) {
    const output = {};
    
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const parts = key.split(' ');
        const position = parts[0]; // e.g., "CEO" or "CTO"
        const attribute = parts.slice(1).join('_'); // e.g., "NAME" or "TITLE"
        
        if (!output[position]) {
          output[position] = {};
        }
        
        output[position][attribute] = input[key];
      }
    }
    
    return output;
  }

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white ml-[42vw] mt-[3vh] font-bold py-2 px-4 rounded mb-4"
        onClick={downloadAsPdf}
      >
        Download as PDF
      </button>
      <div
        id="divToDownload"
        className="flex flex-col w-[90vw] p-[2vh] ml-[5vw] mt-[5vh] rounded-[0.4vw] bg-white"
      >
        <div className="flex flex-row p-[2vh] w-[50vw]">
          <div>
            <p className="text-blue-400 text-[2.2vw] font-bold w-[65vw]">
              {scrappedData?.name || data.CompanyName}
            </p>
            <p className="text-[1.2vw] text-black">{scrappedData?.tagline || data.CompanyDetail}</p>
            <hr className="line2"></hr>
          </div>
          <img src={scrappedData?.profileImg || logo} alt="logo" className="w-[20vw] h-[18vh] ml-[1vw]" />
          {/* {logo ? (
            <img src={scrappedData?.profileImg || logo} alt="logo" className="w-[20vw] h-[18vh] ml-[1vw]" />
          ) : (
            <label
              htmlFor={`upload-button-logo`}
              className="w-[20vw] h-[18vh] bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]"
            >
              <span className="text-gray-500 ml-[2vw] text-[1vw]">
                Upload Image
              </span>
            </label>
          )} */}
          <input
            type="file"
            id="upload-button-logo"
            style={{ display: "none" }}
            onChange={handleLogoChange}
          />

          <input
            type="file"
            id={`upload-button-${data.name}`}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-row">
          <div>
            <div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Company Overwiew
              </h1>
              <div className="flex flex-row w-[36vw] h-[34vh] border-b-[0.18vw] border-[grey]">
                <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[12vw] h-[100%] justify-center items-center">
                  Description
                </p>
                <p className="flex justify-center items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
                  {scrappedData?.description || data.Description}
                </p>
              </div>
              <div className="flex flex-row h-[8vh]">
                <div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[8vw] h-[100%] justify-center items-center">
                    Founded
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[5vw] text-black">
                    {scrappedData?.foundedYear || data.Founded}
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[4vw] h-[100%] justify-center items-center">
                    HQs
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[8vw] text-black">
                    {scrappedData?.headQuaters || data.HQ}
                  </p>
                </div>
                <div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[6vw] h-[100%] justify-center items-center">
                    Employees
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[5vw] text-black">
                    {scrappedData?.employees || data.Employees}
                  </p>
                </div>
              </div>
            </div>
            {loading === false ? (scrappedData?.leadershipOverview && (<div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center mt-[20vh]">
                Company Leaders
              </h1>
              {Object.keys(scrappedData?.leadershipOverview)?.map((key, index) => {
                return (<div key={index} className="flex flex-col">
                  <Leader
                    name={scrappedData?.leadershipOverview[key]['NAME']}
                    position={scrappedData?.leadershipOverview[key]['TITLE']}
                    description={scrappedData?.leadershipOverview[key]['BIO']}
                    image={""}
                  />
                </div>)
              })}
            </div>)) : <div className="loader-container"><div className="content-loader"></div></div>}
          </div>
          <div className="ml-[8vw] w-[36vw]">
            <div className="boxy">
                <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                  Services
                </h1>
                <p className="text-[1vw] underline ml-[1vw] mt-[1vh]">
                  <i>Fastening Systems</i>
                </p>
                <ul className="text-black text-[1vw] mt-[2vh] ml-[2vw] custom-list w-[36vw]">
                  {scrappedData?.services && scrappedData?.services?.map((i, index) => {
                    // const firstKey = Object.keys(scrappedData?.services[i])[0];
                    // const firstValue = scrappedData?.services[i][firstKey];

                    // console.log('item: ', item);
                    return (<li key={index} className="mt-[2vh]">
                      <span className="text-bold font-semibold">{`${i['NAME']}: `}</span>
                      {i['DESCRIPTION']}
                    </li>)
                })}
                </ul>
              </div>
            { loading === false ? (scrappedData.financialOverview &&
            <div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center mt-[5vh]">
                Fastening Systems - Segment Financial Overview
              </h1>
              <div className="overflow-x-auto w-[40vw]">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-[#9c9c9c] bg-opacity-50">
                      {/* <th className="px-4 py-2 text-black text-[0.8vw] w-[20vw] border-l border-r border-gray-300">
                        $ in millions
                      </th>
                      <th className="px-4 py-2 text-black text-[1.1vw] border-l border-rr border-gray-300">
                        FY'22A
                      </th>
                      <th className="px-4 py-2 text-black text-[1.1vw] border-l border-r border-gray-300">
                        Q1'21A
                      </th>
                      <th className="px-4 py-2 text-black text-[1.1vw] border-l border-r border-gray-300">
                        Q2'21A
                      </th>
                      <th className="px-4 py-2 text-black text-[1.1vw] border-l border-r border-gray-300">
                        Q3'21A
                      </th> */}
                      {Object.keys(scrappedData?.financialOverview)?.map(i => <th className="px-4 py-2 text-black text-[1.1vw] border-l border-r border-gray-300">{i}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={"bg-gray-200 px-4 py-2 text-black" || "text-black bg-opacity-20 bg-gray-400 px-4 py-2"} >
                      {Object.values(scrappedData?.financialOverview)?.map(i => <td>{i}</td>)}
                    </tr>
                    {/* {data.tableData.map((row, index) => (
                      // <tr
                      //   key={index}
                      //   className={
                      //     index % 2 === 0
                      //       ? "bg-gray-200 px-4 py-2 text-black"
                      //       : "text-black bg-opacity-20 bg-gray-400 px-4 py-2"
                      //   }
                      // >
                      //   <td>{row.millions}</td>
                      //   <td>{row.fy}</td>
                      //   <td>{row.q1}</td>
                      //   <td>{row.q2}</td>
                      //   <td>{row.q3}</td>
                      // </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
            </div>) : 
            <div className="loader-container"><div className="content-loader"></div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;

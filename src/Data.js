import "./data.css";
import Leader from "./Leader";
import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./apiUrl";

function Data({ data }) {
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState(data.leaders.map(() => null));
  const [scrappedData, setScrappedData] = useState([]); 
  const [loading, setLoading] = useState({
    financialOverview: true,
    leadershipOverview: true,
    strategicFit: true
  });

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
        name: recievedData?.companyOverview['Company Name'],
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
    if(recievedData?.inputs) {
      console.log('inputs: ', recievedData?.inputs);
      console.log('loading apis...');
      const inputs = recievedData?.inputs;
      const formData = new FormData();
      formData.append('context', inputs.context);
      formData.append('company_name', inputs.company_name);
      formData.append('website', inputs.website);
      formData.append('linkedin_url', inputs.linkedin_url);
      formData.append('wikipedia_link', inputs.wikipedia_link);
      formData.append('meeting_notes', inputs.notes);
      for (let i = 0; i < inputs.files.length; i++) {
        formData.append('files', inputs.files[i]);
      }
      axios.post(apiUrl+"financial_overview", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from financial apis: ', res.data);
        let financialOverview = splitExtraText(res.data);
        financialOverview = financialOverview.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        financialOverview = JSON.parse(financialOverview);
        setScrappedData(prev => ({...prev, financialOverview: financialOverview}));
        setLoading(prev => ({...prev, financialOverview: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, financialOverview: false}));
      })
      axios.post(apiUrl+"leadership_overview", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from leadership apis: ', res.data);
        let leadershipOverview = res.data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        leadershipOverview = JSON.parse(leadershipOverview);
        leadershipOverview = restructureJobPositions(leadershipOverview);
        setScrappedData(prev => ({...prev, leadershipOverview: leadershipOverview}));
        setLoading(prev => ({...prev, leadershipOverview: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, leadershipOverview: false}));
      })
      axios.post(apiUrl+"strategic_fit_overview", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from strategic apis: ', res, res.data);
        let strategicFit = res.data.replace(/\\\"/g, '"').replace(/\\"/g, '"').replace(/\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        console.log('strategic fit before: ', strategicFit);
        strategicFit = JSON.parse(strategicFit);
        setScrappedData(prev => ({...prev, strategicFit: strategicFit}));
        setLoading(prev => ({...prev, strategicFit: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, strategicFit: false}));
      })
    }
  }, [])

  function splitExtraText(inputString) {
    const lastTripleBackticksIndex = inputString.lastIndexOf("```");
    if (lastTripleBackticksIndex === -1) {
        return inputString;
    }
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
        <div className="flex flex-row p-[2vh] w-[100vw]">
          <div>
            <p className="text-blue-400 text-[2.2vw] font-bold w-[65vw]">
              {scrappedData?.name || 'Not specified'}
            </p>
            <p className="text-[1.2vw] text-black">{scrappedData?.tagline || 'Not specified'}</p>
            <hr className="line2"></hr>
          </div>
            {logo ? (
              <img src={scrappedData?.profileImg || logo} alt="logo" className="w-[20vw] h-[18vh] ml-[1vw] object-contain" />
            ) : (
              <label
                htmlFor={`upload-button-logo`}
                className="w-[20vw] h-[18vh] bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]"
              >
                <span className="text-gray-500 ml-[2vw] text-[1vw]">
                  Upload Image
                </span>
              </label>
            )}
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
                  {scrappedData?.description || 'Not specified'}
                </p>
              </div>
              <div className="flex flex-row gap-2 h-[8vh]">
                {scrappedData?.foundedYear && (<div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[8vw] h-[100%] justify-center items-center">
                    Founded
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[5vw] text-black">
                    {scrappedData?.foundedYear || 'Not specified'}
                  </p>
                </div>)}
                {scrappedData?.headQuaters && (<div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[4vw] h-[100%] justify-center items-center">
                    HQs
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[8vw] text-black">
                    {scrappedData?.headQuaters || 'Not specified'}
                  </p>
                </div>)}
                {scrappedData?.employees && (<div className="flex flex-row">
                  <p className="flex text-black text-[1vw] font-semibold bg-[#a7a7a7] bg-opacity-50 p-[1vh] w-[6vw] h-[100%] justify-center items-center">
                    Employees
                  </p>
                  <p className="flex text-[1vw] justify-center items-center w-[5vw] text-black">
                    {scrappedData?.employees || 'Not specified'}
                  </p>
                </div>)}
              </div>
            </div>
            {loading?.leadershipOverview === false ? (scrappedData?.leadershipOverview && (<div className="boxy">
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
                    return (<li key={index} className="mt-[2vh]">
                      <span className="text-bold font-semibold">{`${i['NAME']}: `}</span>
                      {i['DESCRIPTION']}
                    </li>)
                })}
                </ul>
              </div>
            { loading?.financialOverview === false ? (scrappedData.financialOverview &&
            <div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center mt-[5vh]">
                Fastening Systems - Segment Financial Overview
              </h1>
              <div className="overflow-x-auto w-[40vw]">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-[#9c9c9c] bg-opacity-50">
                      {Object.keys(scrappedData?.financialOverview)?.map(i => {
                        if(scrappedData?.financialOverview[i]?.toLowerCase().includes('not specified') === false && scrappedData?.financialOverview[i]?.toLowerCase().includes('not available') === false && scrappedData?.financialOverview[i]?.toLowerCase() !== 'n/a') {
                          return (<th className="px-4 py-2 text-left text-black text-[1.1vw] border-l border-r border-gray-300">{i}</th>)
                        }
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={"text-[1.1vw] bg-gray-200 px-4 py-2 text-black" || "text-black bg-opacity-20 bg-gray-400 px-4 py-2"} >
                      {Object.values(scrappedData?.financialOverview)?.map(i => {
                        if(i.toLowerCase().includes('not specified') === false && i.toLowerCase().includes('not available') === false && i.toLowerCase() !== 'n/a') {
                          return (<td>{i}</td>)
                        }
                        })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>) : 
            <div className="loader-container"><div className="content-loader"></div></div>}
              {/* Strategic Fit Start */}
            {loading?.strategicFit === false ? (scrappedData?.strategicFit && (<div className="boxy">
                <div className="flex flex-col mt-[5vh]">
                  <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] mb-[3vh] text-center">
                      Strategic Fit
                  </h1>
                  <div>
                      {Object.entries(scrappedData?.strategicFit)?.map(([sectionTitle, sectionContent], index) => {
                        const key = sectionTitle.replaceAll('_', ' ');
                        return (
                          <div key={index} className="flex flex-row w-[40vw] h-max-content border-b-[0.18vw] border-[grey] mt-4">
                          <div className="flex flex-col justify-center bg-[#a7a7a7] bg-opacity-50">
                          <p className="flex text-black text-[1vw] font-semibold p-[1vh] w-[9vw] justify-center items-center">
                              {key}
                          </p>
                          </div>

                              <div className="flex flex-col justify-start items-start text-black text-[0.9vw] p-[1.2vh] w-full ml-[1vw] h-max-content overflow-auto">
                                  {typeof sectionContent === 'string' ? (
                                      <p>{sectionContent}</p>
                                  ) : (
                                      Object.keys(sectionContent)?.map((key, idx) => {
                                        const temp = key.replaceAll('_', ' ');
                                        return (
                                          <div key={idx} className="flex flex-row mb-2 w-full">
                                              <div className="font-semibold text-[0.85vw] w-[18%]">{temp}:</div>
                                              <div className="ml-[4vw] w-[82%]">{sectionContent[key]}</div>
                                          </div>
                                      )})
                                  )}
                              </div>
                          </div>
                      )})}
                  </div>
              </div>
            </div>)) : <div className="loader-container"><div className="content-loader"></div></div>}
            {/*   Strategic Fit Ends    */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;

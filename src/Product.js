"use client";
import Products from "./Products";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./apiUrl";

function Product({ data }) {
  const [logo, setLogo] = useState(data.logo || null);
  const [loading, setLoading] = useState({
    marketSegmentation: true, customerPartner: true, financialOverview: true, strategicFit: true
  });

  const location = useLocation();
  const recievedData = location.state || {};
  const [scrappedData, setScrappedData] = useState({
    products: null
  });
  console.log('scrappedData: ', scrappedData);

  const handleLogoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(URL.createObjectURL(event.target.files[0]));
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
      pdf.save("Products.pdf");
    });
  };
  useEffect(() => {
    console.log("received data:", recievedData);
    setScrappedData(prev => ({...prev, products: recievedData?.products?.PRODUCTS, companyOverview: recievedData?.companyOverview }))
  }, [recievedData]);

  useEffect(() => {
    // const asyncResponse = async () => {
    //   try {
        // const res = await Promise.all([axios.post(apiUrl+"market_segmentation", formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }),
        // axios.post(apiUrl+"customer_partner", formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }),
        // axios.post(apiUrl+"financial_overview", formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // })
        // ]);
        // console.log('response from /data apis: ', res);
        // let marketSegmentation = res[0].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/^```json/, '').replace(/```$/, '');
        // marketSegmentation = JSON.parse(marketSegmentation);
        // let customerPartner = res[1].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/^```json/, '').replace(/```$/, '');
        // customerPartner = JSON.parse(customerPartner);
        // let financialOverview = res[2].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        // financialOverview = JSON.parse(financialOverview);
        // setScrappedData(prev => ({...prev, marketSegmentation: marketSegmentation, customerPartner: customerPartner, financialOverview: financialOverview}));
        // setLoading(false);
        
    // } catch(e) {
    //   console.log('error in data api: ', e.message || e);
    //   // setLoading(false);
    //   }
    //   }
    if(recievedData?.inputs) {
      console.log('inputs: ', recievedData?.inputs);
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
      console.log('loading apis...');

      axios.post(apiUrl+"market_segmentation", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from market_segmentation apis: ', res.data);
        let marketSegmentation = res.data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/```json/, '').replace(/```$/, '');
        marketSegmentation = JSON.parse(marketSegmentation);
        setScrappedData(prev => ({...prev, marketSegmentation: marketSegmentation}));
        setLoading(prev => ({...prev, marketSegmentation: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, marketSegmentation: false}));
      })
      axios.post(apiUrl+"customer_partner", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from customer_partner apis: ', res.data);
        let customerPartner = res.data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/```json/, '').replace(/```$/, '');
        customerPartner = JSON.parse(customerPartner);
        setScrappedData(prev => ({...prev, customerPartner: customerPartner}));
        setLoading(prev => ({...prev, customerPartner: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, customerPartner: false}));
      })
      axios.post(apiUrl+"financial_overview", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from financial_overview apis: ', res.data);
        let financialOverview = res.data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/```json/, '').replace(/```$/, '');
        financialOverview = JSON.parse(financialOverview);
        setScrappedData(prev => ({...prev, financialOverview: financialOverview}));
        setLoading(prev => ({...prev, financialOverview: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, financialOverview: false}));
      })

      axios.post(apiUrl+"strategic_fit_overview", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('response from strategic apis: ', res, res.data);
        let strategicFit = res.data.replace(/\\\"/g, '"').replace(/\\"/g, '"').replace(/\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        // console.log('strategic fit before: ', strategicFit);
        strategicFit = JSON.parse(strategicFit);
        setScrappedData(prev => ({...prev, strategicFit: strategicFit}));
        setLoading(prev => ({...prev, strategicFit: false}));
      }).catch(e => {
        console.log('error in data api: ', e.message || e);
        setLoading(prev => ({...prev, strategicFit: false}));
      })
    }
  }, [])

  // To be removed
  const StrategicFit = {
    Rational:{Info:"Infosys is a global leader in next-generation digital services and consulting. The company has a strong presence in over 56 countries and has been instrumental in driving digital transformation for its clients across various industries. With over 40 years of experience, Infosys has established itself as a trusted partner for many global enterprises, making it an attractive target for potential buyers or investors looking to enhance their digital capabilities and global reach."},
    "Issues for Consideration": {
      "Market Position":"Infosys is the second-largest Indian IT company by revenue, following Tata Consultancy Services. This strong market position makes it a valuable asset, but also means any buyer or investor would need to navigate competitive pressures within the IT services sector.",
      "Financial Health":"Infosys has demonstrated strong financial performance with revenues reaching US$ 18.55 billion and a market capitalization of US$ 76.29 billion. However, potential investors should consider the company's ability to sustain this growth amidst global economic fluctuations.",
      "Cultural and Operational Integration":"Given Infosys's extensive global operations and diverse workforce, any potential buyer or investor would need to carefully plan for cultural and operational integration to ensure a smooth transition and continued success.",
      "Regulatory and Compliance Challenges":"Operating in multiple jurisdictions exposes Infosys to various regulatory and compliance challenges. Potential investors need to be aware of the legal and regulatory landscapes in the countries where Infosys operates."
    }
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
        <div className="flex flex-row p-[2vh]">
          <div className="w-[65vw]">
            <p className="text-blue-400 text-[2.2vw] font-bold">
              {recievedData?.companyOverview['Company Name'] || 'Not specified'}
            </p>
            <p className="text-[1.2vw] text-black">{recievedData?.companyOverview['Company Tagline'] || 'Not specified'}</p>
            <hr className="line2"></hr>
          </div>
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="w-[20vw] h-[18vh] ml-[1vw]"
            ></img>
          ) : (
            <label
              htmlFor={`upload-button-logo`}
              className="w-[20vw] h-[18vh] bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]"
            >
              <span className="text-gray-500 ml-[2vw] text-[1vw]">
                Upload Image
              </span>
            </label>
            // <div
            //   className="w-[20vw] h-[18vh] bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]"
            // >
            //   <span className="text-gray-500 text-center text-[1vw]">
            //     No Image
            //   </span>
            // </div>
          )}
          <input
            type="file"
            id="upload-button-logo"
            style={{ display: "none" }}
            onChange={handleLogoChange}
          />
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col">
            {!loading?.marketSegmentation ? (<div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Industrial Segment Overwiew
              </h1>
              {scrappedData?.marketSegmentation && Object.keys(scrappedData?.marketSegmentation)?.map(key => {
                return (
                  <div className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                    <p className="flex text-black text-[1vw] font-semibold p-[1vh] w-[12vw]  items-center">
                      {key}
                    </p>
                    <p className="flex items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
                      {scrappedData?.marketSegmentation[key]}
                    </p>
                  </div>
                )
              })}

              {/* <div className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw]  justify-center items-center">
                  Description
                </p>
                <p className="flex justify-center items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
                  {data.Description}
                </p>
              </div>
              <div className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw]  justify-center items-center">
                  Recent M&A
                </p>
                <p className="flex justify-center items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
                  {data.MA}
                </p>
              </div>
              <div className="flex flex-row w-[36vw] h-[max-content] mb-[2vh]">
                <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw]  justify-center items-center">
                  Sector Highlights
                </p>
                <ul className="text-black text-[1vw] mt-[2vh] ml-[2vw] custom-list w-[36vw]">
                  {data.highlights.map((item, index) => (
                    <li key={index} className="mt-[2vh]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>) : <div className="loader-container"><div className="content-loader"></div></div>
            }

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
          <div className="ml-[8vw]">
            <div className='boxy'>
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Products
              </h1>
              {/* {scrappedData?.products && Object.keys(scrappedData?.products)?.map((key, index) => (
                <div key={index} className="flex flex-col">
                  <Products
                    item={key}
                    itemImage={""}
                    discp={scrappedData?.products[key]}
                  />
                </div>
              ))} */}
              {scrappedData?.products && scrappedData?.products?.map((i, index) => {
                if(index < 5) {
                  return (<div key={index} className="flex flex-col">
                      <Products
                        item={i['NAME']}
                        itemImage={""}
                        discp={i['DESCRIPTION']}
                        // onImageChange={(event) => handleImageChange(index, event)}
                      />
                    </div>
                  )
                }
                }
              )}
            </div>
            {!loading?.customerPartner ? (scrappedData?.customerPartner && <div className="boxy mt-[4vh]">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Market Segment for Customer & Partnes
              </h1>
              {/* {Object.keys(scrappedData?.customerPartner)?.map((key, index) => {
                const value = scrappedData?.customerPartner[key];
                return (
                  <div key={index} className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                    <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw] justify-center items-center">
                      {key}
                    </p>
                    <div className="flex flex-col justify-center items-center text-black text-[0.9vw] p-[1.2vh] w-[30vw]">
                      {Object.keys(value)?.map((subKey, subIndex) => (
                        <p key={subIndex}>{`${subKey}: ${item[subKey]}`}</p>
                      ))}
                    </div>
                  </div>
                );
              })} */}
              {/* if the code contains array of objects */}
              {Object.keys(scrappedData?.customerPartner)?.map((key, index) => {
                return (
                  <div key={index} className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                    <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw] justify-center items-center">
                      {key}
                    </p>
                    <div className="flex flex-col justify-center items-left text-black text-[0.9vw] gap-[1.2vh] p-[1.2vh] w-[30vw]">
                      {scrappedData?.customerPartner[key]?.map((item, idx) => {
                        // console.log('data inside: ', item, scrappedData?.customerPartner[key]);
                        return (<div key={idx}>
                          {Object.keys(item).map((subKey, subIndex) => (
                            <span className="inline-block" key={subIndex}><span className="font-semibold">{`${subKey}: `}</span>{`${item[subKey]}`}</span>
                          ))}
                        </div>)
              })}
                    </div>
                  </div>
                );
              })}

            </div>) : <div className="loader-container"><div className="content-loader"></div></div>}
          </div>
        </div>
        {loading?.financialOverview === false ? (scrappedData?.financialOverview && <div className='boxy mt-[4vh]'>
          <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-full text-center">
            Industrial Segmentt - Summary Financials
          </h1>
          <div className="overflow-x-auto w-full">

            <table className="table-auto w-full">
              <thead>
                <tr className="bg-[#cccc] text-white">
                {Object.keys(scrappedData?.financialOverview)?.map(i => {
                  if(scrappedData?.financialOverview[i]?.toLowerCase().includes('not specified') === false && scrappedData?.financialOverview[i]?.toLowerCase().includes('not available') === false && scrappedData?.financialOverview[i]?.toLowerCase() !== 'n/a') {
                    return (<th className="px-4 py-2 text-left text-black text-[1.1vw] border-l border-r border-gray-300">{i}</th>)
                  }
                })}
                  {/* <th className="px-4 py-2 text-[0.8vw] border-l border-r border-gray-300">
                    $ in millions
                  </th>
                  <th className="px-4 py-2 text-[0.8vw] border-l border-r border-gray-300">
                    Q1'21A
                  </th>
                  <th className="px-4 py-2 text-[0.8vw] border-l border-r border-gray-300">
                    Q2'21A
                  </th>
                  <th className="px-4 py-2 text-[0.8vw] border-l border-r border-gray-300">
                    Q3'21A
                  </th> */}
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
                {/* {data.RevenueTable.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-200 px-4 py-2 text-black"
                        : "text-black bg-gray-400 px-4 py-2"
                    }
                  >
                    <td>{row.millions}</td>
                    <td>{row.y1}</td>
                    <td>{row.y2}</td>
                    <td>{row.y3}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>) : <div className="loader-container"><div className="content-loader"></div></div>}
      </div>
    </div>
  );
}

export default Product;

"use client";
import Products from "./Products";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./apiUrl";
import Loading from "./Loading";

function Product({ data }) {
  const [logo, setLogo] = useState(data.logo || null);
  const [productImages, setProductImages] = useState(
    data.ProductsData.map(() => null)
  );
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const recievedData = location.state || {};
  const [scrappedData, setScrappedData] = useState({
    products: null
  });
  console.log('scrappedData: ', scrappedData);

  const handleImageChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const newImages = [...productImages];
      newImages[index] = URL.createObjectURL(event.target.files[0]);
      setProductImages(newImages);
    }
  };
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
    const asyncResponse = async () => {
      try {
        console.log('loading apis...');
        const res = await Promise.all([axios.post(apiUrl+"market_segmentation", recievedData?.inputs, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        axios.post(apiUrl+"customer_partner", recievedData?.inputs, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        axios.post(apiUrl+"financial_overview", recievedData?.inputs, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        ]);
        console.log('response from /data apis: ', res);
        let marketSegmentation = res[0].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/^```json/, '').replace(/```$/, '');
        marketSegmentation = JSON.parse(marketSegmentation);
        let customerPartner = res[1].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '').replace(/^```json/, '').replace(/```$/, '');
        customerPartner = JSON.parse(customerPartner);
        let financialOverview = res[2].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json\n/, '').replace(/```$/, '');
        financialOverview = JSON.parse(financialOverview);
        setScrappedData(prev => ({...prev, marketSegmentation: marketSegmentation, customerPartner: customerPartner, financialOverview: financialOverview}));
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
              {recievedData?.companyOverview['Company Owner'] || data.CompanyName}
            </p>
            <p className="text-[1.2vw] text-black">{recievedData?.companyOverview['Company Tagline'] || data.CompanyDetail}</p>
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
            {!loading ? (<div className="boxy">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Industrial Segment Overwiew
              </h1>
              {Object.keys(scrappedData?.marketSegmentation)?.map(key => {
                return (
                  <div className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                    <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw]  justify-center items-center">
                      {key}
                    </p>
                    <p className="flex justify-center items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
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
              {scrappedData?.products && scrappedData?.products?.map((i, index) => (
                <div key={index} className="flex flex-col">
                  <Products
                    item={i['NAME']}
                    itemImage={""}
                    discp={i['DESCRIPTION']}
                  />
                </div>
              ))}
            </div>
            {!loading ? (scrappedData?.customerPartner && <div className="boxy mt-[4vh]">
              <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-[40vw] text-center">
                Market Segment for Customer & Partnes
              </h1>
              {Object.keys(scrappedData?.customerPartner)?.map(i => {
                const firstKey = Object.keys(scrappedData?.customerPartner[i])[0];
                const firstValue = scrappedData?.customerPartner[i][firstKey];
                return (<div className="flex flex-row w-[36vw] h-[max-content] border-b-[0.18vw] border-[#acacac]">
                  <p className="flex text-black text-[1vw] font-semibold mt-[8%] p-[1vh] w-[12vw]  justify-center items-center">
                    {i}
                  </p>
                  <p className="flex justify-center items-center text-black text-[0.9vw]  p-[1.2vh] w-[30vw]">
                    {/* {JSON.stringify(scrappedData?.customerPartner[i])} */}
                    {`${firstKey}: ${firstValue}`}
                  </p>
                </div>)
                })
              }
            </div>) : <div className="loader-container"><div className="content-loader"></div></div>}
          </div>
        </div>
        {!loading ? (scrappedData?.financialOverview && <div className='boxy'>
          <h1 className="text-white text-[1.4vw] font-semibold bg-[#060647] p-[0.8vh] w-full text-center">
            Industrial Segment - Summary Financials
          </h1>
          <div className="overflow-x-auto w-full">

            <table className="table-auto w-full">
              <thead>
                <tr className="bg-[#cccc] text-white">
                {Object.keys(scrappedData?.financialOverview)?.map(i => <th className="px-4 py-2 text-black text-[1.1vw] border-l border-r border-gray-300">{i}</th>)}
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
                    className={"bg-gray-200 px-4 py-2 text-black" || "text-black bg-opacity-20 bg-gray-400 px-4 py-2"} >
                    {Object.values(scrappedData?.financialOverview)?.map(i => <td>{i}</td>)}
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

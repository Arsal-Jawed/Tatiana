import "./form.css";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import { apiUrl } from "./apiUrl";

function Form() {
  const [context, setContext] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [linkdin, setLinkdin] = useState("");
  const [wikipedia, setWikipedia] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerWeb, setOwnerWeb] = useState("");
  const [segment, setSegment] = useState("");
  const [notes, setNotes] = useState("");
  const [press, setPress] = useState("");
  const [notesFile, setNotesFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search_id, setSearchId] = useState("");

  const handleContext = (e) => setContext(e.target.value);
  const handleCompany = (e) => setCompany(e.target.value);
  const handleWebsite = (e) => setWebsite(e.target.value);
  const handleLinkdin = (e) => setLinkdin(e.target.value);
  const handleWikipedia = (e) => setWikipedia(e.target.value);
  const handleOwner = (e) => setOwner(e.target.value);
  const handleOwnerWeb = (e) => setOwnerWeb(e.target.value);
  const handleSegment = (e) => setSegment(e.target.value);
  const handleNotes = (e) => setNotes(e.target.value);
  const handlePress = (e) => setPress(e.target.value);
  // const handleReportChange = (e) => setFiles(e.target.files[0]);
  // const handleDocument = (e) => setDoc(e.target.files[0]);
  const handleFileChange = (e) => setFiles(e.target.files);

  const navigate = useNavigate();

  // const handleLoadingPage = (id) => {
  //   setLoading(true);
  //   const interval = setInterval(() => {
  //     fetch(`http://localhost:8000/search-status/${id}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.status === "completed") {
  //           clearInterval(interval);
  //           axios
  //             .get(`http://localhost:8000/search/${id}`)
  //             .then((response) => {
  //               const data = JSON.parse(response.data.output_data);
  //               debugger
  //               try {
  //                 if (data.products_and_service[0].OFFERING === "PRODUCT") {
  //                   navigate("/product", { state: data });
  //                 } else {
  //                   navigate("/data", { state: data });
  //                 }
  //               } catch (error) {
  //                 navigate("/data", { state: data });
  //               }
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle error
  //         console.log(error);
  //         setLoading(false);
  //       });
  //   }, 2000);
  // };

  const SubmitProfiler = async (e) => {
    try {
      e.preventDefault();
      const websiteRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      const linkedInRegex = /^(https?):\/\/(www\.)?linkedin\.com\/.*$/;
      const wikipediaRegex =
        /^(https?):\/\/(www\.)?en\.wikipedia\.org\/wiki\/.*$/;
  
      const isValidURL = (url, regex) => {
        return regex.test(url);
      };
  
      if (
              context.trim() === '' ||
              company.trim() === '' ||
              website.trim() === '' ||
              linkdin.trim() === '' ||
              wikipedia.trim() === ''
          ) {
              setError('Please fill in all required fields.');
              return;
      } else {
          setError('');
      }
  
      if(!isValidURL(website.trim(), websiteRegex) ){
          setError('please enter a valid website link');
          return;
      }else{setError('');}
      if(!isValidURL(linkdin.trim(), linkedInRegex) ){
          setError('please enter a valid LinkedIn link');
          return;
      }else{setError('');}
      if(!isValidURL(wikipedia.trim(), wikipediaRegex) ){
          setError('please enter a valid Wikipedia link');
          return;
      }else{setError('');}
  
      const data = {
        context: context,
        company_name: company,
        website: website,
        linkedin_url: linkdin,
        wikipedia_link: wikipedia,
        owner: owner,
        ownerWeb: ownerWeb,
        segment: segment,
        notes: notes,
        press: press,
        files: files,
        // report: report,
        input_text: false,
      }
  
      // const requestBody = JSON.stringify({
      //   context: context,
      //   company: company,
      //   website: website,
      //   linkdin: linkdin,
      //   wikipedia: wikipedia,
      //   owner: owner,
      //   ownerWeb: ownerWeb,
      //   segment: segment,
      //   notes: notes,
      //   press: press,
      //   notesFile: notesFile,
      //   report: report,
      //   input_text: false,
      // });
  
      // const formData = new FormData();
      // formData.append("search_request", JSON.stringify(requestBody));
      // formData.append('files', doc);

      const inputs = {

      }
      
      const formData = new FormData();
      formData.append('context', context);
      formData.append('company_name', company);
      formData.append('website', website);
      formData.append('linkedin_url', linkdin);
      formData.append('wikipedia_link', wikipedia);
      formData.append('meeting_notes', notes);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
  
      console.log('loading start...');
      setLoading(true);
      console.log('data: ', data);
      console.log('formData: ', formData);
      console.log('files: ', files);

      const res = await Promise.all([axios.post(apiUrl+"products_and_services", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        await axios.post(apiUrl+"company_overview", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      ]);

      console.log('api res main: ', res);
      let temp = res[0].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '\n').replace(/^```json/, '').replace(/```$/, '');
      temp = JSON.parse(temp);
      console.log('response from products api: ', temp, res[0].data);
      let companyOverview = res[1].data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\n/g, '\n').replace(/^```json/, '').replace(/```$/, '');
      companyOverview = JSON.parse(companyOverview);
      console.log('response from company_overview api: ', companyOverview, res[1].data);
      if(temp['OFFERING'] && (temp['OFFERING'] === 'PRODUCT' || temp['OFFERING'] === 'PRODUCTS' || temp['OFFERING'] === 'LIST OF OFFERINGS' || temp['OFFERING'] === 'OFFERINGS')) {
        navigate('/product', { state: { companyOverview, products: temp, inputs: data }});
      } else if(temp['OFFERING'] && (temp['OFFERING'] === 'SERVICE' || temp['OFFERING'] === 'SERVICES' || temp['OFFERING'] === 'LIST OF OFFERINGS' || temp['OFFERING'] === 'OFFERINGS')) {
        navigate('/data', { state: { data: { companyOverview, services: temp, inputs: data } }});
      }

      //  extractors api for test
      // const res = await axios.post(apiUrl+"strategic_fit_overview", formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      // console.log('api response direct: ', res.data);
      // let temp = res.data.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/^```json/, '').replace(/```$/, '');
      // temp = JSON.parse(temp);
      // console.log('response from extranctors api: ', temp);
    } catch(e) {
      setLoading(prev => false);
      setError(e.message || e);
      console.log('form api error: ', e.message || e);
    }
  };

  return (
    <>
    <div className="form_container">
      <h2 className="heading">Profiler</h2>
      <div>
        <p className="guide">Please provide context for this research</p>
        <hr className="line"></hr>
        <label className="label">Context:</label>
        <textarea
          type="text"
          placeholder="Enter Context of Interest....."
          className="field"
          value={context}
          onChange={handleContext}
          id="context"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="guide">
          Please provide known company information for this research
        </p>
        <hr className="line"></hr>
        <div style={{ display: "flex", flexDirection: "row", gap: "5vw" }}>
          <div>
            <label className="label">Company:</label>
            <input
              type="text"
              placeholder="Enter Company"
              className="field"
              value={company}
              onChange={handleCompany}
              id="company"
            />
          </div>
          <div>
            <label className="label">Website:</label>
            <input
              type="text"
              placeholder="Enter Website"
              className="field"
              value={website}
              onChange={handleWebsite}
              id="website"
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "5vw" }}>
          <div>
            <label className="label">LinkedIn:</label>
            <input
              type="text"
              placeholder="Enter LinkedIn"
              className="field"
              value={linkdin}
              onChange={handleLinkdin}
              id="linkdin"
            />
          </div>
          <div>
            <label className="label">Wikipedia:</label>
            <input
              type="text"
              placeholder="Enter Wikipedia"
              className="field"
              value={wikipedia}
              onChange={handleWikipedia}
              id="wikipedia"
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="guide">Does this company have an owner ? (Optional)</p>
        <hr className="line"></hr>
        <div style={{ display: "flex", flexDirection: "row", gap: "5vw" }}>
          <div>
            <label className="label">Owner Name:</label>
            <input
              type="text"
              placeholder="Enter Owner"
              className="field"
              value={owner}
              onChange={handleOwner}
              id="owner"
            />
          </div>
          <div>
            <label className="label">Owner Website:</label>
            <input
              type="text"
              placeholder="Enter Owner Website"
              className="field"
              value={ownerWeb}
              onChange={handleOwnerWeb}
              id="ownerWeb"
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "5vw" }}>
          <div>
            <label className="label">Segment:</label>
            <input
              type="text"
              placeholder="Enter Segment"
              className="field"
              value={segment}
              onChange={handleSegment}
              id="segment"
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="guide">
          Are there any meeting notes we should consider ? (optional)
        </p>
        <hr className="line"></hr>
        <label className="label">Meeting Notes:</label>
        <textarea
          type="text"
          placeholder="Enter Notes....."
          className="field"
          value={notes}
          onChange={handleNotes}
          id="notes"
        />
        {/* <p
          style={{
            color: "white",
            fontSize: "2vw",
            fontWeight: "bold",
            marginLeft: "16vw",
          }}
        >
          --- OR ---
        </p>
        <input
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx"
          id="fileUpload"
          onChange={handleFileChange}
        />
        <label htmlFor="fileUpload" className="file-label">
          Choose a File
        </label>
        {notesFile && <p>Selected file: {notesFile.name}</p>} */}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: '1.5rem' }}>
        <p className="guide">
          Is there any specific information you would like us to consider ?
          (optional)
        </p>
        <hr className="line"></hr>
        <label className="label">Financial Information:</label>
        <input
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx"
          id="NotesUpload"
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="NotesUpload" className="file-label">
          Choose a File
        </label>
        {/* {files && <p>Selected file: {files.name}</p>} */}
        {files?.length > 0 && <p>File(s) selected</p>}
      </div>
      {/* <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="guide">
          Do you have any document to consider ? (optional)
        </p>
        <hr className="line"></hr>
        <label className="label">Document:</label>
        <input
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx"
          id="ReportUpload"
          onChange={handleDocument}
        />
        <label htmlFor="ReportUpload" className="file-label">
          Choose a File
        </label>
        {doc && <p>Selected file: {doc.name}</p>}
      </div> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="guide">
          Would you like to consider press release ? (optional)
        </p>
        <hr className="line"></hr>
        <label className="label">Press Release:</label>
        <input
          type="text"
          placeholder="Enter Press"
          className="field"
          value={press}
          onChange={handlePress}
          id="press"
        />
        <hr className="line"></hr>
      </div>
      <button className="submit" onClick={SubmitProfiler}>
        Submit
      </button>
      <p style={{ color: "rgb(255, 0, 0)", fontSize: "1.4vw" }}>{error}</p>
    </div>
    { loading && <Loading /> }
    </>
  );
}

export default Form;

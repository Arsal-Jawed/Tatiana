import './form.css';
import React, { useState } from 'react';

function Form() {
    const [context, setContext] = useState('');
    const [company, setCompany] = useState('');
    const [website, setWebsite] = useState('');
    const [linkdin, setLinkdin] = useState('');
    const [wikipedia, setWikipedia] = useState('');
    const [owner, setOwner] = useState('');
    const [ownerWeb, setOwnerWeb] = useState('');
    const [segment, setSegment] = useState('');
    const [notes, setNotes] = useState('');
    const [press, setPress] = useState('');
    const [notesFile, setNotesFile] = useState(null);
    const [report,setReport] = useState(null);
    const [doc, setDoc] = useState(null);
    const [error, setError] = useState('');

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
    const handleFileChange = (e) => setNotesFile(e.target.files[0]);
    const handleReportChange = (e) => setReport(e.target.files[0]);
    const handleDocument = (e) => setDoc(e.target.files[0]);

    const SubmitProfiler = (e) => {
            
        e.preventDefault();
        const websiteRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const linkedInRegex = /^(https?):\/\/(www\.)?linkedin\.com\/.*$/;
        const wikipediaRegex = /^(https?):\/\/(www\.)?en\.wikipedia\.org\/wiki\/.*$/;
        
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
        
            const formData = new FormData();
            formData.append('context', context);
            formData.append('company', company);
            formData.append('website', website);
            formData.append('linkdin', linkdin);
            formData.append('wikipedia', wikipedia);
            formData.append('owner', owner);
            formData.append('ownerWeb', ownerWeb);
            formData.append('segment', segment);
            formData.append('notes', notes);
            formData.append('press', press);
            formData.append('notesFile', notesFile);
            formData.append('report', report);
            formData.append('doc', doc);

            fetch('yourEndpoint', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                
            })
            .catch(error => {
                
            });
     
            const Profiler = {
                context: context,
                company: company,
                website: website,
                linkdin: linkdin,
                wikipedia: wikipedia,
                owner: owner,
                ownerWeb: ownerWeb,
                segment: segment,
                notes: notes,
                press: press,
                notesFile: notesFile,
                report: report,
                doc: doc
            };
    }

    return (
        <div className='form_container'>
            <h2 className='heading'>Profiler</h2>
            <div>
            <p className='guide'>Please provide context for this research</p>
            <hr className='line'></hr>
            <label className='label'>Context:</label>
            <textarea
                type='text'
                placeholder='Enter Context of Interest.....'
                className='field'
                value={context}
                onChange={handleContext}
                id='context'
            />
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Please provide known company information for this research</p>
            <hr className='line'></hr>
            <div style={{display:'flex', flexDirection:'row', gap:'5vw'}}>
            <div>
            <label className='label'>Company:</label>
            <input
                type='text'
                placeholder='Enter Company'
                className='field'
                value={company}
                onChange={handleCompany}
                id='company'
            /></div>
            <div><label className='label'>Website:</label>
            <input
                type='text'
                placeholder='Enter Website'
                className='field'
                value={website}
                onChange={handleWebsite}
                id='website'
            /></div>
            </div>
            <div style={{display:'flex', flexDirection:'row', gap:'5vw'}}>
            <div><label className='label'>LinkedIn:</label>
            <input
                type='text'
                placeholder='Enter LinkedIn'
                className='field'
                value={linkdin}
                onChange={handleLinkdin}
                id='linkdin'
            /></div>
            <div><label className='label'>Wikipedia:</label>
            <input
                type='text'
                placeholder='Enter Wikipedia'
                className='field'
                value={wikipedia}
                onChange={handleWikipedia}
                id='wikipedia'
            /></div></div>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Does this company have an owner ? (Optional)</p>
            <hr className='line'></hr>
            <div style={{display:'flex', flexDirection:'row', gap:'5vw'}}>
           <div>
            <label className='label'>Owner Name:</label>
            <input
                type='text'
                placeholder='Enter Owner'
                className='field'
                value={owner}
                onChange={handleOwner}
                id='owner'
            />
            </div>
            <div>
            <label className='label'>Owner Website:</label>
            <input
                type='text'
                placeholder='Enter Owner Website'
                className='field'
                value={ownerWeb}
                onChange={handleOwnerWeb}
                id='ownerWeb'
            />
            </div>
            </div>
            <div style={{display:'flex', flexDirection:'row', gap:'5vw'}}>
            <div>
            <label className='label'>Segment:</label>
            <input
                type='text'
                placeholder='Enter Segment'
                className='field'
                value={segment}
                onChange={handleSegment}
                id='segment'
            />
            </div>
            </div>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Are there any meeting notes we should consider ? (optional)</p>
            <hr className='line'></hr>
           <label className='label'>Meeting Notes:</label>
            <textarea
                type='text'
                placeholder='Enter Notes.....'
                className='field'
                value={notes}
                onChange={handleNotes}
                id='notes'
            />
            <p style={{color:'white', fontSize:'2vw', fontWeight:'bold', marginLeft:'16vw'}}>--- OR ---</p>
            <input
                type='file'
                className='file-input'
                accept='.pdf,.doc,.docx'
                id='fileUpload'
            />
            <label htmlFor="fileUpload" className="file-label">Choose a File</label>
            {notesFile && <p>Selected file: {notesFile.name}</p>}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Is there any specific information you would like us to consider ? (optional)</p>
            <hr className='line'></hr>
            <label className='label'>Financial Information:</label>
            <input
                type='file'
                className='file-input'
                accept='.pdf,.doc,.docx'
                id='fileUpload'
            />
            <label htmlFor="fileUpload" className="file-label">Choose a File</label>
            {report && <p>Selected file: {report.name}</p>}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Do you have any document to consider ? (optional)</p>
            <hr className='line'></hr>
            <label className='label'>Document:</label>
            <input
                type='file'
                className='file-input'
                accept='.pdf,.doc,.docx'
                id='fileUpload'
            />
            <label htmlFor="fileUpload" className="file-label">Choose a File</label>
            {report && <p>Selected file: {report.name}</p>}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
            <p className='guide'>Would you like to consider press release ? (optional)</p>
            <hr className='line'></hr>
            <label className='label'>Press Release:</label>
            <input
                type='text'
                placeholder='Enter Press'
                className='field'
                value={press}
                onChange={handlePress}
                id='press'
            />
            <hr className='line'></hr>
            </div>
            <button className='submit' onClick={SubmitProfiler}>Submit</button>
            <p style={{color:'rgb(255, 0, 0)', fontSize:'1.4vw'}}>{error}</p>
        </div>
    );
}

export default Form;

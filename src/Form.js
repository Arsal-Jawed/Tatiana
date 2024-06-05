import './form.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

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
    const [loading, setLoading] = useState(false);
    const [search_id, setSearchId] = useState('');

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

    const navigate = useNavigate();

    const handleLoadingPage = () => {
        setLoading(true);
        
        setInterval(() => {
            fetch(`http://localhost:8000/search-status/${search_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'completed') {
                        // stop interval
                        this.clearInterval();

                        // now call the data from  search/<search_id> endpoint, and check the data then if offering == PRODUCT, then redirect to product page, if offering == SERVICE, then redirect to service page
                        // response looks like {'search_id': 10, 'output_data': '{"vector_store_id": "vs_hXBYW9gJRyYcHooVWv4N2K7g", "financial_overview": [{"2021 Revenue": "\\u00e2\\u0082\\u00ac659.8 million", "2021 EBITDA": "Not specified", "2021 EBITDA MARGIN": "Not specified", "TOTAL DEBT": "Not specified", "DEBT/EBITDA": "Not specified"}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "company_overview": [{}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "leadership_overview": [{"CEO NAME": "Gabriele del Torchio", "CEO TITLE": "Chairman & Chief Executive Officer", "CEO BIO": "Gabriele del Torchio serves as the Chairman and Chief Executive Officer of Guala Closures. He has a significant leadership background and has held various prominent positions in the industry."}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "products_and_service": [{"OFFERING": "PRODUCT", "OFFERINGS": [{"NAME": "Blossom Sustainable Closures", "DESCRIPTION": "A comprehensive range of sustainable closures for spirits, wine, water, and beverages. Each closure follows at least one of the four eco-design models: Design to Reduce, Design to Change, Design to Fade, and Design to Revive."}, {"NAME": "Aluminum and Non-Refillable Caps", "DESCRIPTION": "Closures for the wine, spirits, water, and beverages market. These include non-refillable caps to ensure product integrity and safety."}, {"NAME": "Customized Solutions", "DESCRIPTION": "Tailored closures combining innovation and tradition to meet unique requirements for various beverages, ensuring quality and uniqueness."}]}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "market_segment": [{"NAME": "Packaging & Containers", "DESCRIPTION": {"Spirits Closures": "Closures specifically designed for the spirits industry, offering premium design and security features to protect the integrity and quality of the product.", "Wine Closures": "Innovative and traditional closure solutions for the wine industry, ensuring quality and uniqueness to meet diverse customer needs.", "Water & Beverages Closures": "High-quality closures for water and a wide range of beverages, designed to provide convenience and protection while enhancing the brand image.", "Edible Oil Closures": "Specialized closures for edible oil products, focusing on maintaining product quality and preventing contamination.", "Luxury Bottle Closures": "Premium design closures for luxury bottles, combining aesthetics with functionality to enhance the overall product experience."}}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "customer_partner": [{"PARTNERS": {"Investindustrial": "Global private equity firm focused on buyouts of mid-market companies in Europe and selectively in North America."}, "CUSTOMERS": {}}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"], "strategic_fit": [{"Strategic Fit": {"Rationale": "Guala Closures, founded in Italy in 1954, is a leading global producer of closures for spirits, wine, edible oil, water, and a wide range of other beverages. Its established global footprint with 33 production plants and 7 R&D centers across five continents allows it to offer localized services and solutions in more than 100 countries. The company focuses on high-quality, sustainable, and innovative closure solutions that enhance brand image and provide convenience to consumers. Guala Closures\' strategy aligns with the increasing demand for premium and custom packaging solutions in the beverage industry, making it an attractive investment opportunity.", "Issues for Consideration": ["Market Position: Guala Closures is a leader in the closures market with a significant global presence and a production capacity of over 18 billion closures per year. Its strong market position and extensive customer base provide a competitive advantage.", "Sustainability: The company\'s commitment to sustainable practices, such as its eco-design guidelines (Design to Reduce, Design to Change, Design to Fade, and Design to Revive), is crucial in meeting the growing consumer demand for environmentally friendly products.", "Innovation: Guala Closures\' continuous investment in R&D and its ability to innovate in premium design and luxury bottle closures are key factors in maintaining its market leadership.", "Financial Performance: Evaluating the company\'s financial health, including revenue trends, profitability, and debt levels, is essential for potential investors to understand the risks and returns associated with the investment.", "Ownership and Management: Guala Closures is private equity-backed, with Investindustrial acquiring a controlling stake in June 2021. Understanding the strategic direction and management capabilities under Investindustrial\'s ownership is vital."]}, "References": ["Guala Closures LinkedIn Profile\\u00e3\\u0080\\u00904:0\\u00e2\\u0080 source\\u00e3\\u0080\\u0091", "Guala Closures Website\\u00e3\\u0080\\u00904:2\\u00e2\\u0080 source\\u00e3\\u0080\\u0091", "Investindustrial Wikipedia Entry\\u00e3\\u0080\\u00904:4\\u00e2\\u0080 source\\u00e3\\u0080\\u0091"]}, "vs_hXBYW9gJRyYcHooVWv4N2K7g"]}'}
                        axios.get(`http://localhost:8000/search/${search_id}`)
                            .then(response => {
                                data = JSON.parse(response.data.output_data);
                                
                                //////////    Transfering Data to Data    ///////////
                                navigate('/data',{state: data});


                                try {if (data.products_and_service[0].OFFERING === 'PRODUCT') {
                                    // redirect to product page
                                    window.location.href = '/product';
                                } else {
                                    // redirect to service page
                                    window.location.href = '/data';
                                }} catch (error) {
                                    // Handle error
                                    window.location.href = '/data';
                                }
                            })
                            .catch(error => {
                                // Handle error
                            });
                        
                    }
                    
                })
                .catch(error => {
                    // Handle error
                });
        }, 2000);
    }

    

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

            axios.post('http://localhost:8000/create-search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                setSearchId(response.data.search_id);
                handleLoadingPage(response.data.search_id);
            })
            .catch(error => {
                alert(error.message)
            });
     
            
    }

    return (
       ( !loading ? <div className='form_container'>
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
        </div> : <Loading/>)
    );
}

export default Form;

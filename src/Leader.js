import './leader.css';

function Leader(props) {
    return (
        <div className='flex flex-row mt-[5vh]'>
            <div className='flex flex-col justify-center items-center'>
                <div className='relative w-[8vw] h-[16vh] rounded-[4vw] overflow-hidden'>
                    {props?.image ? (
                        <img src={props?.image} alt="leader pic" className='w-full h-full object-cover rounded-[4vw] transform hover:scale-125 transition duration-300' />
                    ) : (
                        // <label htmlFor={`upload-button-${props.name}`} className='w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]'>
                        //     <span className='text-gray-500 ml-[2vw] text-[1vw]'>Upload Image</span>
                        // </label>
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer rounded-[4vw]'>
                            <span className='text-gray-500 text-center'>No Image</span>
                        </div>
                    )}
                    {/* <input type="file" id={`upload-button-${props.name}`} style={{ display: 'none' }} onChange={props.onImageChange} /> */}
                </div>
                <p className='text-[#060647] text-[1.2vw] mt-[2vh] font-semibold'>{props.name}</p>
                <p className='text-[1vw] text-black'><i>{props.position}</i></p>
            </div>
            
            <ul className='text-black text-[0.8vw] mt-[2vh] ml-[2vw] custom-list'>
                {/* {props.description.map((item, index) => (
                    <li key={index} className='mt-[2vh] w-[26vw]'>{item}</li>
                ))} */}
                <li className='mt-[2vh] w-[26vw]'>{props.description}</li>
            </ul>
        </div>
    );
}

export default Leader;

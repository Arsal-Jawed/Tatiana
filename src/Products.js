
function Products(props) {
    return (
        <div className="flex flex-row mt-[4vh] w-[38vw]">
            <div className='relative w-[10vw] h-[12vh] overflow-hidden' style={{ borderRadius: '0.6vw' }}>
                {props.itemImage ? (
                    <img src={props.itemImage} alt="product image" className='w-full h-full object-cover' style={{ borderRadius: '0.6vw' }} />
                ) : (
                    <label htmlFor={`upload-product-button-${props.item}`} className='w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer' style={{ borderRadius: '0.6vw' }}>
                        <span className='text-gray-500 ml-[2vw] text-[1vw]'>Upload Image</span>
                    </label>
                )}
                <input type="file" id={`upload-product-button-${props.item}`} style={{ display: 'none' }} onChange={props.onImageChange} />
            </div>
            <div className="border-b-[0.2vw] w-[34vw] border-dashed border-blue-500 ml-[1vw]">
                <p className="text-[1.2vw] text-black underline mb-[1vh]"><i>{props.item}</i></p>
                <p className="text-[0.9vw] text-black">{props.discp}</p>
            </div>
        </div>
    );
}

export default Products;

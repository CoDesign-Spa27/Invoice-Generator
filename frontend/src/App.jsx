import React, { useState } from "react";
import axios from "axios";
import Input from "./components/Input";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Compressor from "compressorjs"
function InvoiceForm() {
  const [invoiceData, setInvoiceData] = useState({
    sellerName: "",
    sellerAddress: "",
    sellerCity: "",
    sellerState: "",
    sellerPincode: "",
    sellerPAN: "",
    sellerGST: "",
    placeOfSupply: "",
    billingName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    billingStateCode: "",
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingStateCode: "",
    placeOfDelivery: "",
    orderNo: "",
    orderDate: "",
    invoiceNo: "",
    invoiceDate: "",
    items: [{ description: "", unitPrice: 0, quantity: 0, discount: 0 }],
    signaturePlaceholder:""
  });

  const [generatedInvoice, setGeneratedInvoice] = useState("");
  const [error, setError] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const invoiceRef = useRef(null); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]:
        name === "unitPrice" || name === "quantity" || name === "discount"
          ? parseFloat(value)
          : value,
    };

    setInvoiceData((prevData) => ({ ...prevData, items: updatedItems }));
  };

  const addItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { description: "", unitPrice: 0, quantity: 0, discount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prevData) => ({ ...prevData, items: updatedItems }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/generate-invoice",
        invoiceData
      );
      setGeneratedInvoice(response.data.invoiceHtml);
    } catch (error) {
      setError("Fill all the inputs or Please try again.");
      console.error("Error generating invoice:", error);
    }
  };


  
const handleSignatureChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    new Compressor(file, {
      quality: 0.6, 
      maxWidth: 1024,  
      maxHeight: 1024, 
      success: (compressedFile) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSignatureImage(reader.result);
          setInvoiceData((prevData) => ({
            ...prevData,
            signaturePlaceholder: reader.result
          }));
        };
        reader.readAsDataURL(compressedFile);
      },
      error: (err) => {
        console.error('Compression error:', err);
      }
    });
  }
};

  

  const downloadPdf = () => {
    const element = invoiceRef.current;  
  
    if (element) {
     
      html2canvas(element, {
        scale: 2,  
        width: 794,  
        height: 1123,  
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4",true);
 
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
 
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
       
        if (imgHeight > pageHeight) {
          const scaleFactor = pageHeight / imgHeight;
          pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            imgWidth * scaleFactor,
            imgHeight * scaleFactor
          );
        } else {
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }
  
        pdf.save("invoice.pdf");
      });
    } else {
      console.error("Element not found");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-[#1C1B26] text-[#F2B9B4] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8  text-center">Create Invoice</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#282437] p-6 rounded-lg shadow-md w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Seller Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={"Seller Name"}
              type="text"
              name="sellerName"
              value={invoiceData.sellerName}
              onChange={handleInputChange}
              className="mt-1 tex-lg py-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm "
            />
          </div>
          <div>
            <Input
              label={"Seller Address"}
              type="text"
              name="sellerAddress"
              value={invoiceData.sellerAddress}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Seller City"}
              type="text"
              name="sellerCity"
              value={invoiceData.sellerCity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Seller State"}
              type="text"
              name="sellerState"
              value={invoiceData.sellerState}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Seller Pincode"}
              type="text"
              name="sellerPincode"
              value={invoiceData.sellerPincode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Seller PAN"}
              type="text"
              name="sellerPAN"
              value={invoiceData.sellerPAN}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Seller GST No."}
              type="text"
              name="sellerGST"
              value={invoiceData.sellerGST}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Place of supply"}
              type="text"
              name="placeOfSupply"
              value={invoiceData.placeOfSupply}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Billing Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={"Billing Name"}
              type="text"
              name="billingName"
              value={invoiceData.billingName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Billing Address"}
              type="text"
              name="billingAddress"
              value={invoiceData.billingAddress}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Billing City"}
              type="text"
              name="billingCity"
              value={invoiceData.billingCity}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Billing State "}
              type="text"
              name="billingState"
              value={invoiceData.billingState}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Billing Pincode"}
              type="text"
              name="billingPincode"
              value={invoiceData.billingPincode}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Billing State Code"}
              type="text"
              name="billingStateCode"
              value={invoiceData.billingStateCode}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Place of Delivery"}
              type="text"
              name="placeOfDelivery"
              value={invoiceData.placeOfDelivery}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={"Shipping Name"}
              type="text"
              name="shippingName"
              value={invoiceData.shippingName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Shipping Address"}
              type="text"
              name="shippingAddress"
              value={invoiceData.shippingAddress}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Shipping City"}
              type="text"
              name="shippingCity"
              value={invoiceData.shippingCity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Shipping State"}
              type="text"
              name="shippingState"
              value={invoiceData.shippingState}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Shipping Pincode"}
              type="text"
              name="shippingPincode"
              value={invoiceData.shippingPincode}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label={"Shipping State Code"}
              type="text"
              name="shippingStateCode"
              value={invoiceData.shippingStateCode}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={"Order No"}
              type="text"
              name="orderNo"
              value={invoiceData.orderNo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Order Date"}
              type="date"
              name="orderDate"
              value={invoiceData.orderDate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Invoice No"}
              type="text"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Input
              label={"Invoice Date"}
              type="date"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Items Details</h2>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-center mb-4">
            <div>
              <Input
                label={"Item Description"}
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                className="Input col-span-2"
              />
            </div>
            <div>
              <Input
                label={"Unit Price"}
                type="number"
                name="unitPrice"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <Input
                label={"Qty"}
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <div>
              <Input
                label={"Discount"}
                type="number"
                name="discount"
                value={item.discount}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="btn-danger col-span-1"
            >
              Remove
            </button>
          </div>
        ))}

<h2 className="text-2xl font-semibold mb-4">Signature</h2>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleSignatureChange}
            className="text-white bg-neutral-600 text-sm border rounded px-4 py-2"
          />
          <p className="text-sm text-gray-300 pt-2">Please Enter image size of 1 MB</p>
        </div>

        {signatureImage && (
          <div className="mb-4">
            <img src={signatureImage} alt="Signature" className="w-32 h-16 object-contain" />
          </div>
        )}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        <div className="flex flex-col gap-2 justify-center ">

        <button
          type="button"
          onClick={addItem}
          className="btn-primary max-w-sm"
          >
          Add Item
        </button>


        <button type="submit" className="btn-submit max-w-sm">
          Generate Invoice
        </button>
          </div>
      </form>

      {generatedInvoice && (
        <div className="max-w-sm">

        <button onClick={downloadPdf} className="btn-primary w-full mt-4">
          Download Invoice as PDF
        </button>
        </div>
      )}
      {generatedInvoice && (
        <div ref={invoiceRef}
          dangerouslySetInnerHTML={{ __html: generatedInvoice }}
          className=" p-6 rounded-lg shadow-md w-full max-w-3xl"
        />
      )}
    </div>
  );
}

export default InvoiceForm;

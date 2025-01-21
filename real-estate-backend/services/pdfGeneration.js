import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Readable } from 'stream';

async function getImageBuffer(url) {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }


  // Function to draw footer text
function drawFooter(doc) {
    const footerText = "Report Generated using Free trial of Inspect Buddy";
    const footerFontSize = 10;

    // Position the footer at the bottom of the page
    const footerY = doc.page.height - doc.page.margins.bottom + 5; // Slight padding from the bottom
    doc.fontSize(footerFontSize).fillColor('gray').text(footerText, doc.page.margins.left, footerY, {
        align: 'center',
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right
    });
}

  // Utility function to incorporate element images together
    function incorporateElementImages(imagesarray, captionarray, elements) {
        // Iterate through each element and add the corresponding image
        elements.forEach((element, index) => {
            // Check if the image exists for the current element
            console.log(element);
            if (element.image && element.image.url && element.image.url !== '') 
            {
                imagesarray.push(element.image.url);
                captionarray.push(element.name);
            }
        });

        return imagesarray;
    }



  
    // Utility function to transform elements into table data
  function transformElementsToTableData(elements) {
    return elements.map(element => {
        // Map through the checklist to format questions with their answers
        const formattedChecklist = element.checklist.map(item => {
            const choices = item.options.map(option => option.option).join(', ');
            return `${item.text} (${choices}): ${item.answer}`;
        });

        // Return the new format for the tableData
        return [element.name, formattedChecklist, element.note];
    });
}

  // Utility function to check if there's enough space for a given height
  function ensureSpaceFor(height, doc) {
    const availableSpace = doc.page.height - doc.y - 10; // Leave 10 units for bottom margin
    if (height > availableSpace) {
        doc.addPage();
        doc.y = doc.page.margins.top; // Reset the y-coordinate after adding a new page
        return doc.y;
    }
    else
    {
        return doc.y;
    }
  }
  
  export const createPDF = async(filepath, rooms, reportName, reportAddress, inspectionDate, reportDate, inspectorName, inspectorRole, inspectorSignature, collaborators, role) =>
  {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filepath));

    // Add footer to each page
    doc.on('pageAdded', () => {
        drawFooter(doc);
    });
  
    // Add image from URL
    const imageUrl = 'https://www.iconsdb.com/icons/preview/tropical-blue/square-rounded-xxl.png';
    const imageBuffer = await getImageBuffer(imageUrl);
    doc.image(imageBuffer, 50, 50, { width: 100 });
  
    // Business name on the right
    doc.fontSize(20).font('Helvetica-Bold').text('Real Estate Inspection Application', 200, 50, { width: 400 });
  
    // Separator
    doc.rect(50, 180, 500, 4).fill('#CCCCCC');
  
    // Big bold text
    doc.fillColor("black").fontSize(22).font('Helvetica-Bold').text(`${reportName}`, 50, 200);

    doc.moveDown(); // Adjust spacing
  
    // Smaller bold medium text
    doc.fillColor("black").fontSize(16).font('Helvetica-Bold').text(`${reportAddress}`, { align: 'left' });

    doc.moveDown(); // Adjust spacing
  
    // Small font text with background color
    const inspectedText = `Inspected on ${inspectionDate} | Report Created on ${reportDate}`;
    const textWidth = doc.widthOfString(inspectedText);
    const textHeight = doc.currentLineHeight();
    doc.rect(50, doc.y - 3 - textHeight / 2, textWidth - 230, textHeight).fill('#ECEEEF');
    doc.fillColor("black").fontSize(8).font('Helvetica').text(inspectedText, 55, doc.y - textHeight / 2);

    doc.moveDown().moveDown(); // Adjust spacing

    // Separator
    doc.rect(50, doc.y, 500, 4).fill('#CCCCCC');

    doc.moveDown().moveDown(); // Adjust spacing

    // Iterate through each room
    for (const room of rooms) 
    {    
        var { name, image, note, elements } = room;
        var imagesarray = [];
        var captionarray = [];

        if (Array.isArray(image) && image.length > 0) {

          image.forEach((img) => {
            imagesarray.push(img.url);
            captionarray.push(img.caption);
          });
            
        }
        else
        {
            imagesarray = [];
        }

        // Adding Room Name
        const roomName = name;
        const roomNameHeight = doc.heightOfString(roomName, { width: 500 });
        doc.y = ensureSpaceFor(roomNameHeight + 10, doc); // Check space and add page if necessary
        doc.fillColor("black").fontSize(18).font('Helvetica-Bold').text(roomName, 50, doc.y);

        doc.moveDown(); // Adjust spacing

        // Define a fixed width for the text block
        const noteBlockWidth = 500; // Adjust this value as needed

        // Calculate the initial position and draw the text
        const noteText = note;
        const textOptions = { width: noteBlockWidth, align: 'left' };

        // Save the current vertical position (y)
        const yPosition = doc.y;

        // Draw the text within the block, respecting the fixed width
        doc.fillColor("black").fontSize(8).font('Helvetica').text(noteText, 55, doc.y, textOptions);

        // Calculate the height of the text block after wrapping
        const wrappedTextHeight = doc.y - yPosition;

        doc.y = ensureSpaceFor(wrappedTextHeight + 6 + 20, doc);

        // Draw the background rectangle with the correct height
        doc.rect(50, yPosition - 3, noteBlockWidth, wrappedTextHeight + 6).fill('#ECEEEF');

        // Redraw the text to ensure it's on top of the rectangle
        doc.fillColor("black").fontSize(8).font('Helvetica').text(noteText, 55, yPosition, textOptions);

        // console.log("Trying")
        if (Array.isArray(elements) && elements.length > 0) 
        {
            // Table
            doc.moveDown().moveDown(); // Adjust spacing


            // Define the table dimensions
            const tableTotalWidth = 500;
            const columnWidths = [tableTotalWidth / 3, tableTotalWidth / 3, tableTotalWidth / 3];
            const tableLeft = 50;
            let tableTop = doc.y;

            // Custom data array for table rows
            // const tableData = [
            //     ['Door', ['Firm? (Yes/No): Yes', 'Durable? (Yes/No): Yes'], 'Good Condition'],
            //     ['Window', ['Not Checked'], 'Needs Repair'],
            //     ['Floor', ['Checked'], 'Minor Scratches'],
            //     ['Wall', ['Checked'], 'No Issues'],
            //     ['Ceiling', ['Not Checked'], 'Stains Present']
            // ];

            const tableData = transformElementsToTableData(elements);

            // Draw table headers
            var headerHeight = 30;
            doc.y = ensureSpaceFor(headerHeight, doc); // Ensure space for headers
            doc.fontSize(10).font('Helvetica-Bold');
            ['Element', 'Checklist', 'Note'].forEach((text, i) => {
                const x = tableLeft + i * columnWidths[i];
                doc.rect(x, tableTop, columnWidths[i], headerHeight).stroke("#e1e4e6");
                doc.fillColor('black').text(text, x + 5, tableTop + 10, { width: columnWidths[i], align: 'left' });
            });

            tableTop += headerHeight; // Move the tableTop down after headers

            // Draw table rows dynamically from the array
            doc.fontSize(10).font('Helvetica');
            tableData.forEach((rowData, rowIndex) => {
                let rowHeight = 0;

                // Calculate the row height based on the most lengthy element in the row
                rowData.forEach((text, i) => {
                    let textHeight = 0;

                    // If the text is an array, calculate the height for each item
                    if (Array.isArray(text)) {
                        text.forEach((line) => {
                            textHeight += doc.heightOfString(line, { width: columnWidths[i] - 10 });
                        });
                    } else {
                        textHeight = doc.heightOfString(text, { width: columnWidths[i] - 10 });
                    }

                    // Determine the maximum row height based on the content
                    rowHeight = Math.max(rowHeight, textHeight);
                });

                rowHeight += 10; // Add some padding for the row height
                doc.y = ensureSpaceFor(rowHeight, doc); // Ensure space for the row

                // Draw the cells and text
                rowData.forEach((text, i) => {
                    const x = tableLeft + i * columnWidths[i];
                    const y = tableTop;

                    // Check if the row exceeds the page height, if so, add a new page
                    if (y + rowHeight > doc.page.height - 50) {
                        doc.addPage();
                        doc.y = 50;
                        tableTop = doc.y; // Reset tableTop to the top of the new page
                    }

                    // Draw the cell rectangle
                    doc.rect(x, tableTop, columnWidths[i], rowHeight).stroke("#e1e4e6");

                    // Draw the text within the cell, with padding and alignment
                    if (Array.isArray(text)) {
                        // If text is an array, draw each item on a new line
                        let lineY = tableTop + 5;
                        text.forEach((line) => {
                            doc.fillColor('black').text(line, x + 5, lineY, { width: columnWidths[i] - 10, align: 'left' });
                            lineY += doc.heightOfString(line, { width: columnWidths[i] - 10 });
                        });
                    } else {
                        // If text is a string, draw it normally
                        doc.fillColor('black').text(text, x + 5, tableTop + 5, { width: columnWidths[i] - 10, align: 'left' });
                    }
                });

                // Move the tableTop down by the height of the row
                tableTop += rowHeight;
            });

        }

        console.log ("Prior to element images", imagesarray);

        //incorporate images
        imagesarray = incorporateElementImages(imagesarray, captionarray, elements);

        // console.log("Trying 2");

        if (Array.isArray(imagesarray) && imagesarray.length > 0) 
        {
            doc.moveDown().moveDown(); // Adjust spacing

            doc.fillColor("black").fontSize(18).font('Helvetica-Bold').text('Photos', 50);
        
            // Images grid
            doc.moveDown();// Adjust spacing
            const imageSize = 100;
            const margin = 10;
            // const images = [
            //     'http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg',
            //     'http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg',
            //     'http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg',
            //     'http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg',
            //     'http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg'
            // ];

            console.log("Images array length", imagesarray.length);
            console.log("Images array", imagesarray);

            for (const [index, imgUrl] of imagesarray.entries()) 
            {
                console.log(imagesarray.length);
              // console.log("Index and Image URL", index, imgUrl);
                if (index % 4 === 0 && index !== 0) {
                doc.moveDown(imageSize + margin); // Move down after every row
                }

                let spaceNeeded = imageSize + margin + 7; // Add some extra space for the caption

                // Check if the image fits on the page
                doc.y = ensureSpaceFor(spaceNeeded, doc);

                const imageBuffer = await getImageBuffer(imgUrl);

                const captionValue = captionarray[index];

                const x = 50 + (index % 4) * (imageSize + margin);
                const y = doc.y + (Math.floor(index / 4) * (imageSize + margin));
                // console.log("X and Y", x, y);
                doc.image(imageBuffer, x, y, { width: imageSize });

                const captionY = y + imageSize + 5; // Position caption below the image
                doc.fontSize(10).text(captionValue, x, captionY, { width: imageSize, align: 'center' });

                // return doc.y for image placement
                if (index <= imagesarray.length - 1) {
                  doc.y = y;
                }
            }

            doc.addPage(); // Add a new page after all images are placed
            doc.y = doc.page.margins.top; // Reset the y-coordinate after adding a new page
            
        }

        // console.log("Trying 2.5");

        // doc.moveDown().moveDown(); // Adjust spacing

      }

    //   console.log("doc.y", doc.y);

      doc.fillColor("black").fontSize(18).font('Helvetica-Bold').text("Regards to our stakeHolders,", 50, doc.y);

      doc.moveDown().moveDown(); // Adjust spacing

      // Add the inspector's name
      doc.fillColor("black").fontSize(14).font('Helvetica-Bold').text(`Inspector: ${inspectorName}`, 50, doc.y);
      doc.fillColor("black").fontSize(11).font('Helvetica').text(inspectorRole, 50, doc.y);

      // add text "Signature" and infront of it add inspector signature
      const inspectorSignatureBuffer = await getImageBuffer(inspectorSignature.url);
      const signaturewidth = 100;
      const signatureheight = 30;
      doc.image(inspectorSignatureBuffer, 50, doc.y, { width: signaturewidth, height: signatureheight });
      
      console.log("Trying 3");
      for (const collaborator of collaborators) 
      {
          const { name, email, role, signature } = collaborator;

          doc.moveDown(5); // Adjust spacing

          doc.y = ensureSpaceFor(100, doc); // Ensure space for the collaborator

          // Add the collaborator's name
          doc.fillColor("black").fontSize(14).font('Helvetica-Bold').text(`${name}`, 50, doc.y);
          doc.fillColor("black").fontSize(11).font('Helvetica').text(email, 50, doc.y);
          doc.fillColor("black").fontSize(11).font('Helvetica').text(role, 50, doc.y);

          // add text "Signature" and infront of it add collaborator signature
          const collaboratorSignatureBuffer = await getImageBuffer(signature.url);
          doc.image(collaboratorSignatureBuffer, 50, doc.y, { width: signaturewidth, height: signatureheight  });
      }


      // Collaborators

    //   console.log("Collaborators: ", collaborators);

  
    // Finalize PDF file
    doc.end();

}


//   const filePath = path.join(process.cwd(), 'uploads', `pdf-${Date.now()}.pdf`);
  
//   createPDF(
// filePath,
// [
//     {
//       "name": "Room 1",
//       "image": [{"url":"http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg", caption: "Room Image"}],
//       "imageForced": true,
//       "note": "This is room 1",
//       "elements": 
//       [
//         {
//           "name": "Element 1",
//           "image": "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg",
//           "imageForced": true,
//           "note": "This is element 1",
//           "checklist": [
//             {
//               "text": "Question 1",
//               "options": ["Yes", "No","N/A"],
//               "answer":"Yes"
//             }
//           ]
//         }
//       ]
//     },
//     {
//         "name": "Room 2",
//         "image": [{"url":"http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg", caption: "Room Image"}],
//         "imageForced": true,
//         "note": "This is room 1",
//         "elements": 
//         [
//           {
//             "name": "Element 1",
//             "image": "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg",
//             "imageForced": true,
//             "note": "This is element 1",
//             "checklist": [
//               {
//                 "text": "Question 1",
//                 "options": ["Yes", "No","N/A"],
//                 "answer":"Yes"
//               }
//             ]
//           },
//           {
//             "name": "Element 2",
//             "image": "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg",
//             "imageForced": true,
//             "note": "This is element 1",
//             "checklist": [
//               {
//                 "text": "Question 1",
//                 "options": ["Yes", "No","N/A"],
//                 "answer":"Yes"
//               }
//             ]
//           }
//         ]
//       }
// ],
// "Inspector's Whatever Name",
// "Landlord",
// "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg",
// [
//   {
//     "name": "Ali Hussain",
//     "email": "alihussain@gmail.com",
//     "role": "Visitor",
//     "signature": "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg"
//   },
//   {
//     "name": "Kamil Ali",
//     "email": "kamilali@gmail.com",
//     "role": "Property Dealer",
//     "signature": "http://res.cloudinary.com/happy-inspector-app/image/upload/v1722978047/iopp3i32lkrd7r0zpufj.jpg"
//   }
// ]
// ).catch(console.error);


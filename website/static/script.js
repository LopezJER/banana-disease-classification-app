function startFolderUpload() {
  const folderInput = document.getElementById("folderInput");
  const progressContainer = document.getElementById("progressContainer");
  const fileCountElement = document.getElementById("fileCount");
  const folderNameElement = document.getElementById("folderName");

  folderInput.style.display = "none";
  progressContainer.style.display = "block";

  const selectedFiles = folderInput.files;
  const fileCount = selectedFiles.length;

  fileCountElement.textContent = fileCount;

  if (fileCount > 0) {
    const formData = new FormData();
    for (let i = 0; i < fileCount; i++) {
      const file = selectedFiles[i];
      formData.append("folder", file, file.name);
    }

    // Display the selected folder name
    const folderName = selectedFiles[0].webkitRelativePath.split("/")[0];
    folderNameElement.textContent = folderName; // Update folder name element

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        document.getElementById("progressBar").value = percentComplete;
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Folder uploaded successfully");
        location.reload();
      } else {
        console.error("Folder upload failed");
        location.reload();
      }
    };

    xhr.onerror = function (error) {
      console.error("Error:", error);
      location.reload();
    };

    xhr.send(formData);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var firstImage = document.querySelector('.gallery-container img');
  var firstImageUrl = firstImage.getAttribute('src');
  var firstImageFileName = firstImageUrl.split('/').pop();
  var placeholder = document.getElementById('placeholder');
  var currentImageIndex = 0;
  placeholder.setAttribute('src', firstImageUrl);
  displayFilename(firstImageFileName);


  var images = document.querySelectorAll(".card-img-top");

  images.forEach(function (image) {
    image.addEventListener("click", function () {
      var fileName = this.src.split('/').pop();
      updatePlaceholder(this.src, fileName);
      updateTableDetails(fileName); // Add this line
    });
  });
  // Function to update the table on app initialization
  function updateTableOnAppStart() {
    const firstImage = document.querySelector('.gallery-container img');
    const firstImageUrl = firstImage.getAttribute('src');
    const firstImageFileName = firstImageUrl.split('/').pop();
    const placeholder = document.getElementById('placeholder');
    const currentImageIndex = 0;
    placeholder.setAttribute('src', firstImageUrl);
    displayFilename(firstImageFileName);
    updateTableDetails(firstImageFileName);
  }

  // Call the function to update the table on app start
  updateTableOnAppStart();


  var prevButton = document.getElementById('prevButton');
  var nextButton = document.getElementById('nextButton');

  prevButton.addEventListener("click", function () {
    var images = document.querySelectorAll(".card-img-top");
    if (currentImageIndex > 0) {
      currentImageIndex--;
      var prevImage = images[currentImageIndex];
      var prevImageFileName = prevImage.src.split('/').pop();
      updatePlaceholder(prevImage.src, prevImageFileName, currentImageIndex);

      // Update inspectImage in the modal
      var inspectImage = document.getElementById('inspectImage');
      inspectImage.src = prevImage.src;

      // Clear prediction and confidence
      clearPredictionAndConfidence();

      // Get the data for the currently displayed image
      var fileName = document.getElementById('filenameDisplay').textContent;
      var treeID = document.getElementById('treeidDisplay').textContent;
      var diagnosis = document.getElementById('diagnosisDisplay').textContent;
      var author = document.getElementById('authorDisplay').textContent;
      var part = document.getElementById('partDisplay').textContent;
      var status = document.getElementById('statusDisplay').textContent;
      var location = document.getElementById('locationDisplay').textContent;
      var captureTime = document.getElementById('capturetimeDisplay').textContent;
      var modifiedTime = document.getElementById('modifiedtimeDisplay').textContent;

      // Update the modal table
      updateModalTable(fileName, treeID, diagnosis, author, part, status, location, captureTime, modifiedTime);
    }


  });

  nextButton.addEventListener("click", function () {
    var images = document.querySelectorAll(".card-img-top");
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      var nextImage = images[currentImageIndex];
      var nextImageFileName = nextImage.src.split('/').pop();
      updatePlaceholder(nextImage.src, nextImageFileName, currentImageIndex);

      // Update inspectImage in the modal
      var inspectImage = document.getElementById('inspectImage');
      inspectImage.src = nextImage.src;

      // Clear prediction and confidence
      clearPredictionAndConfidence();

      // Get the data for the currently displayed image
      var fileName = document.getElementById('filenameDisplay').textContent;
      var treeID = document.getElementById('treeidDisplay').textContent;
      var diagnosis = document.getElementById('diagnosisDisplay').textContent;
      var author = document.getElementById('authorDisplay').textContent;
      var part = document.getElementById('partDisplay').textContent;
      var status = document.getElementById('statusDisplay').textContent;
      var location = document.getElementById('locationDisplay').textContent;
      var captureTime = document.getElementById('capturetimeDisplay').textContent;
      var modifiedTime = document.getElementById('modifiedtimeDisplay').textContent;

      // Update the modal table
      updateModalTable(fileName, treeID, diagnosis, author, part, status, location, captureTime, modifiedTime);
    }
  });

  // Add event listener for quarantine button click
  var quarantineButton = document.getElementById('quarantineButton');
  if (quarantineButton) {
    quarantineButton.addEventListener('click', function () {
      var quarantineModal = new bootstrap.Modal(document.getElementById('quarantineModal'));
      var placeholderImage = document.getElementById('placeholder');
      var quarantineImage = document.getElementById('quarantineImage');
      var quarantineText = document.getElementById('quarantineText');
      var currentImageName = document.getElementById('filenameDisplay').textContent;

      // Set the source of the image in the modal
      quarantineImage.src = placeholderImage.src;

      // Set the quarantine confirmation text
      quarantineText.textContent = " " + currentImageName + "?";

      // Show the modal
      quarantineModal.show();

      // Add event listener for confirm quarantine button click
      document.getElementById('confirmQuarantine').addEventListener('click', function () {
        // Add code here to handle quarantine action
        console.log("Image quarantined: " + currentImageName);

        // Close the modal
        quarantineModal.hide();
      });
    });
  }


  // Add a console.log statement to verify if this code block is executed
  console.log("DOMContentLoaded event handler executed");
});


function displayFilename(filename) {
  console.log("Displaying filename:", filename);
  var filenameDisplay = document.getElementById("filenameDisplay");
  filenameDisplay.textContent = filename;
}
function updatePlaceholder(imageSrc, fileName, index) {
  var placeholder = document.getElementById("placeholder");
  placeholder.src = imageSrc;
  displayFilename(fileName);

  currentImageIndex = index; // Update the current image index

  console.log("updatePlaceholder function called");

  // Update table details when placeholder is updated
  updateTableDetails(fileName);
}

function updateModalTable(filename, treeid, diagnosis, author, part, status, location, capturetime, modifiedtime) {
  document.getElementById('modalfilenameDisplay').innerHTML = filename;
  document.getElementById('modaltreeidDisplay').innerHTML = treeid;
  document.getElementById('modaldiagnosisDisplay').innerHTML = diagnosis;
  document.getElementById('modalauthorDisplay').innerHTML = author;
  document.getElementById('modalpartDisplay').innerHTML = part;
  document.getElementById('modalstatusDisplay').innerHTML = status;
  document.getElementById('modallocationDisplay').innerHTML = location;
  document.getElementById('modalcapturetimeDisplay').innerHTML = capturetime;
  document.getElementById('modalmodifiedtimeDisplay').innerHTML = modifiedtime;

}


/* Copy filename to an input field when updating metadata to send to the backend */
// const updateMetaDateModal = document.querySelector("#updateMetaDateModal");
// const quarantineModal = document.querySelector("#updateMetaDateModal");
const formModals = document.querySelectorAll(".form-modal");
const filenameInputs = document.querySelectorAll(".filename-input");

formModals.forEach(modal => {
  modal.addEventListener('show.bs.modal', () => {
    const filenameDisplay = document.querySelector("#filenameDisplay");
    filenameInputs.forEach(input => {
      input.value = filenameDisplay.innerHTML;
    });
  });
})


function inspect() {
  var inspectModal = new bootstrap.Modal(document.getElementById('inspectModal'));
  var inspectImage = document.getElementById('inspectImage');
  var placeholderImage = document.getElementById('placeholder');

  // Set the source of the image in the modal
  inspectImage.src = placeholderImage.src;

  // Get the data for the currently displayed image
  var fileName = document.getElementById('filenameDisplay').textContent;
  var treeID = document.getElementById('treeidDisplay').textContent;
  var diagnosis = document.getElementById('diagnosisDisplay').textContent;
  var author = document.getElementById('authorDisplay').textContent;
  var part = document.getElementById('partDisplay').textContent;
  var status = document.getElementById('statusDisplay').textContent;
  var location = document.getElementById('locationDisplay').textContent;
  var captureTime = document.getElementById('capturetimeDisplay').textContent;
  var modifiedTime = document.getElementById('modifiedtimeDisplay').textContent;

  // Update the modal table
  updateModalTable(fileName, treeID, diagnosis, author, part, status, location, captureTime, modifiedTime);

  // Show the modal
  inspectModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
  // Your existing code here...

  // Function to handle the search button click event
  function handleFileNameSearch() {
    const searchTerm = document.getElementById("filename-input").value;
    const url = `/?filename=${encodeURIComponent(searchTerm)}`;
    window.location.href = url; // Redirect to the filtered URL
  }

  // Attach the handleSearch function to the search button click event
  document
    .getElementById("search-filename-button")
    .addEventListener("click", handleFileNameSearch);

  // Add a console.log statement to verify if this code block is executed
  console.log("DOMContentLoaded event handler executed");
});

document.addEventListener("DOMContentLoaded", function () {
  // Your existing code here...

  // Function to handle the TreeID search button click event
  function handleTreeIDSearch() {
    const treeId = document.getElementById("treeid-input").value;
    const url = `/?treeid=${encodeURIComponent(treeId)}`;
    window.location.href = url; // Redirect to the filtered URL
  }

  // Attach the handleTreeIDSearch function to the TreeID search button click event
  document
    .getElementById("search-treeid-button")
    .addEventListener("click", handleTreeIDSearch);

  // Add a console.log statement to verify if this code block is executed
  console.log("DOMContentLoaded event handler executed");
});


a = document.querySelector("#modalfilenameDisplay");
// document.querySelector("#modalfilenameDisplay").style.color = "pink";

console.log(document.getElementById('modalfilenameDisplay'));

// Initialize an object to store selected categories
const selectedCategories = {
  diagnosis: [],
  author: null,
  parts: null,
  status: null,
  location: null
};

// Function to update the selected categories object
function updateSelectedCategories() {
  // Update selected diagnosis categories
  selectedCategories.diagnosis = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(input => input.value);

  // Update selected author category
  selectedCategories.author = document.querySelector('select.author-select')
    ? document.querySelector('select.author-select').value
    : null;

  // Update selected parts category
  selectedCategories.parts = document.querySelector('select.part-select')
    ? document.querySelector('select.part-select').value
    : null;

  // Update selected status category
  selectedCategories.status = document.querySelector('select.status-select')
    ? document.querySelector('select.status-select').value
    : null;

  // Update selected location category
  selectedCategories.location = document.querySelector('select.location-select')
    ? document.querySelector('select.location-select').value
    : null;
}

// Function to build the filter string
function buildFilter() {
  const { diagnosis, author, parts, status, location } = selectedCategories;

  // Build the filter string
  const filter = `${diagnosis.join('+')}+${author}+${parts}+${status}+${location}`;

  return filter;
}

document.addEventListener("DOMContentLoaded", function () {
  // Your existing code here...

  // Function to handle the Filter Search button click event
  function handleFilterSearch() {
    console.log('Search button clicked'); // Add this line for debugging
    updateSelectedCategories();
    const filter = buildFilter();
    const url = `/?filter=${encodeURIComponent(filter)}`;
    window.location.href = url;
    console.log(window.location.href);
  }

  // Attach the handleFilterSearch function to the Filter Search button click event
  document
    .getElementById("filterSearchButton")
    .addEventListener("click", handleFilterSearch);

  // Add a console.log statement to verify if this code block is executed
  console.log("DOMContentLoaded event handler executed");
});

function updateTableDetails(filename) {
  fetch(`/get_details/${filename}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('treeidDisplay').innerHTML = data.treeID;
      document.getElementById('diagnosisDisplay').innerHTML = data.diagnosis;
      document.getElementById('authorDisplay').innerHTML = data.author;
      document.getElementById('partDisplay').innerHTML = data.part;
      document.getElementById('statusDisplay').innerHTML = data.status;
      document.getElementById('locationDisplay').innerHTML = data.location;
      document.getElementById('capturetimeDisplay').innerHTML = data.captureTime;
      document.getElementById('modifiedtimeDisplay').innerHTML = data.modifiedTime;
      // Add similar lines for other details
    })
    .catch(error => console.error('Error:', error));
}


/* Show values in json */

// Read the categories.json and save its contents globally
fetch('/static/json/categories.json')
  .then(response => response.json())
  .then(data => saveCategories(data))

let categories;
function saveCategories(categories) {
  categories = categories;
  createOptions(categories);
  updateAddCategoryModalContents(categories);
}

/* Create the checkboxes/select options based on the categories in the json file */
function createOptions(categories) {
  // Select required DOM elements in Update Metadata Modal
  updateMetadataModal = document.querySelector("#updateMetaDateModal");
  diagnosisContainers = document.querySelectorAll(".diagnosis-container");
  authorSelects = document.querySelectorAll(".author-select");
  partSelects = document.querySelectorAll(".part-select");
  statusSelects = document.querySelectorAll(".status-select");
  locationSelects = document.querySelectorAll(".location-select");

  // Create diagnosis checkbox for each disease
  console.log(diagnosisContainers);
  diagnosisContainers.forEach((container, i) => {
    container.replaceChildren();
    categories["diagnosis"].forEach(diagnosis => {
      container.innerHTML += `
            <div class="form-check w-50 text-start my-auto d-flex flex-row gap-2">
            <input class="form-check-input" type="checkbox" value="${diagnosis}" name="${diagnosis}-checkbox" id="${diagnosis}-checkbox-${i}">
            <label class="form-check-label w-100" for="${diagnosis}-checkbox-${i}">
            ${diagnosis}
            </label>
          </div>
        `;

    })
  });

  // Create author select option for each disease
  authorSelects.forEach(select => {
    select.innerHTML = `<option selected disabled value="">Select Author</option>`;
    categories["author"].forEach(author => {
      select.innerHTML += `
        <option value="${author}">${author}</option>
        `
    });
  })

  // Create part select option for each disease
  partSelects.forEach(select => {
    select.innerHTML = `<option selected disabled value="">Select Part</option>`;
    categories["part"].forEach(part => {
      select.innerHTML += `
        <option value="${part}">${part}</option>
        `
    })
  })

  // Create status select option for each disease
  statusSelects.forEach(select => {
    select.innerHTML = `<option selected disabled value="">Select Status</option>`;
    categories["status"].forEach(status => {
      select.innerHTML += `
        <option value="${status}">${status}</option>
        `
    })
  })

  // Create location select option for each disease
  locationSelects.forEach(select => {
    select.innerHTML = `<option selected disabled value="">Select Location</option>`;
    categories["location"].forEach(location => {
      select.innerHTML += `
        <option value="${location}">${location}</option>
        `
    })
  })

}

/* Manipulate contents of add category modal based on selected add category btn */
function updateAddCategoryModalContents(categories) {
  const addCategoryBtns = document.querySelectorAll(".add-category-btn");
  const textToEdit = document.querySelector(".add-category-label");
  const addCategoryForm = document.querySelector("#add-category-form");
  const submitNewCategoryBtn = document.querySelector(".submit-new-category-btn");
  const newCategoryInputField = document.querySelector(".add-category-input");
  const categoriesInJsonInputFields = document.querySelectorAll(".categories-in-json");
  const modalBackBtns = document.querySelectorAll(".go-back-btn");
  let currentSelectedCategory;
  let isFromFilterMenu = false;

  // Write placeholders for inputs with different category
  const categoryToPlaceholdersMap = new Map();
  categoryToPlaceholdersMap.set("Diagnosis", "e.g., Bacterial wilt");
  categoryToPlaceholdersMap.set("Author", "e.g., Sieg");
  categoryToPlaceholdersMap.set("Location", "e.g., Apayao");

  // Update the contents of text and placeholders in add category modal 
  // based on clicked add category btn
  addCategoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentSelectedCategory = btn.closest(".row").firstElementChild.textContent;
      textToEdit.textContent = currentSelectedCategory;
      newCategoryInputField.placeholder = categoryToPlaceholdersMap.get(currentSelectedCategory);

      if (btn.classList.contains("from-filter")) {
        isFromFilterMenu = true;
        modalBackBtns.forEach(btn => {
          btn.removeAttribute("data-bs-target");
        });
      }
      else {
        isFromFilterMenu = false;
        modalBackBtns.forEach(btn => {
          btn.setAttribute("data-bs-target", "#updateMetaDateModal");
        });
      }
    });
  });


  // Validate and prepare the given option before adding it as an selectable option
  submitNewCategoryBtn.addEventListener("click", () => {
    // Lowercase the selected category as it the keys to the category object 
    // are all lowercased
    lowerCasedSelectedCategory = currentSelectedCategory.toLowerCase();
    options = categories[`${lowerCasedSelectedCategory}`]
    // Lowercase all possible options and the given option for better comparison
    lowerCasedOptions = options.map(option => {
      return option.toLowerCase();
    })
    // Simply consecutive spaces into single space and trim starting 
    // and ending whitespaces
    optionToAdd = newCategoryInputField.value.toLowerCase().replace(/\s+/g, ' ').trim();

    // Ensure given option is not empty
    if (!optionToAdd) {
      console.log("No entered value.");
      return;
    }

    // Ensure given option is not already an option
    if (lowerCasedOptions.includes(optionToAdd)) {
      console.log("Already in the list!!!");
      return;
    }

    console.log("ADDING CATEGORY");
    // Uppercase 1st letter of given option to match the format of other options
    optionToAdd = optionToAdd.charAt(0).toUpperCase() + optionToAdd.slice(1);

    // Add the given option to the existing options
    categories[`${lowerCasedSelectedCategory}`].push(optionToAdd);

    // Write the new categories in an input field which will be used to update 
    // the json file itself on the backend
    categories_in_str = JSON.stringify(categories);
    categoriesInJsonInputFields.forEach(field => {
      field.value = categories_in_str;
    })

    console.log(isFromFilterMenu, addCategoryForm);
    if (isFromFilterMenu) addCategoryForm.submit();
    else {
      // Rewrite the categories checkboxes/select options
      createOptions(categories);
    }
  })
}


/* Fill up update metadata modal form with current values of the selected banana image */

updateMetadataModal = document.querySelector("#updateMetaDateModal");
updateMetadataModal.addEventListener("show.bs.modal", () => {
  currentDiagnosis = document.querySelector("#diagnosisDisplay");
  currentAuthor = document.querySelector("#authorDisplay");
  currentPart = document.querySelector("#partDisplay");
  currentStatus = document.querySelector("#statusDisplay");
  currentLocation = document.querySelector("#locationDisplay");

  diagnosisCheckBoxes = document.querySelectorAll("#updateMetaDateModal .diagnosis-container > div > input");
  authorOptions = document.querySelectorAll("#updateMetaDateModal .author-select > option");
  partOptions = document.querySelectorAll("#updateMetaDateModal .part-select > option");
  statusOptions = document.querySelectorAll("#updateMetaDateModal .status-select > option");
  locationOptions = document.querySelectorAll("#updateMetaDateModal .location-select > option");

  // Split the diagnosis text into an array of strings
  let diagnoses = currentDiagnosis.textContent.split(";");
  // Remove extra whitespaces at the start and end to ensure that the format matches
  diagnoses = diagnoses.map(diagnosis => {
    return diagnosis.trim();
  })

  // Check all the current diagnosis
  for (checkBox of diagnosisCheckBoxes) {
    if (diagnoses.includes(checkBox.nextElementSibling.textContent.trim())) {
      checkBox.checked = true;
    }
    else checkBox.checked = false;
  }

  // Select the current value of the category
  for (option of authorOptions) {
    if (option.textContent == currentAuthor.textContent) {
      option.selected = true;
    }
    else option.selected = false;
  }

  for (option of partOptions) {
    if (option.textContent == currentPart.textContent) {
      option.selected = true;
    }
    else option.selected = false;
  }

  for (option of statusOptions) {
    if (option.textContent == currentStatus.textContent) {
      option.selected = true;
    }
    else option.selected = false;
  }

  for (option of locationOptions) {
    if (option.textContent == currentLocation.textContent) {
      option.selected = true;
    }
    else option.selected = false;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Function to update the placeholder image
  function updatePlaceholderWithFirstImage() {
    var firstImage = document.querySelector('.gallery-container img');
    var firstImageUrl = firstImage.getAttribute('src');
    var firstImageFileName = firstImageUrl.split('/').pop();
    var placeholder = document.getElementById('placeholder');
    currentImageIndex = 0;
    placeholder.setAttribute('src', firstImageUrl);
    displayFilename(firstImageFileName);
  }

  // Initial call to update the placeholder with the first image
  updatePlaceholderWithFirstImage();
  function attachPaginationListeners() {
    document.querySelectorAll('.pagination-link').forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const pageUrl = this.href;
        const pageNumber = pageUrl.split('=')[1]; // Extract page number from URL

        history.pushState({}, '', `?page=${pageNumber}`); // Update URL

        fetch(pageUrl)
          .then(response => response.text())
          .then(html => {
            console.log('Received HTML:', html);
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const newImages = newDoc.querySelector('.gallery-container').querySelectorAll('img');

            const galleryContainer = document.querySelector('.gallery-container');
            const existingImages = galleryContainer.querySelectorAll('img');

            newImages.forEach((newImage, index) => {
              console.log('Updating image', index, 'with src:', newImage.src);
              existingImages[index].src = newImage.src; // Update src attribute of existing images
            });

            const paginationContainer = document.querySelector('.pagination');
            const newPagination = newDoc.querySelector('.pagination');

            paginationContainer.innerHTML = newPagination.innerHTML; // Update pagination


            // After updating gallery container and pagination, update the placeholder with the first image
            updatePlaceholderWithFirstImage();

            attachPaginationListeners(); // Re-attach event listeners after updating the pagination
          })
          .catch(error => console.error('Error fetching page:', error));
      });
    });
  }

  attachPaginationListeners(); // Attach event listeners initially
});

const loadingModal = document.querySelector(".loading-modal");
const predictingModal = new bootstrap.Modal('.predicting-modal');

const updateLoadingModal = () => {
  const spinner = loadingModal.querySelector(".spinner-border");
  const label = loadingModal.querySelector("h1");
  const closeBtn = loadingModal.querySelector(".btn-close");
  const header = loadingModal.querySelector(".modal-header");

  label.textContent = "See predictions at ./website/static/csv/";
  spinner.classList.add("visually-hidden");
  closeBtn.classList.remove("visually-hidden");
  header.classList.add("justify-content-center");
}


loadingModal.addEventListener(("hidden.bs.modal"), () => {
  const spinner = loadingModal.querySelector(".spinner-border");
  const label = loadingModal.querySelector("h1");
  const closeBtn = loadingModal.querySelector(".btn-close");
  const header = loadingModal.querySelector(".modal-header");

  spinner.classList.remove("visually-hidden");
  label.textContent = "Predicting...";
  closeBtn.classList.add("visually-hidden");
  header.classList.remove("justify-content-center");
});


// Function to handle image selection and diagnosis
$("#diagnose-specimen-btn").click(function (event) {
  // Get the image URL from the 'inspectImage' element
  const imageUrl = $("#inspectImage").attr("src");

  // Send the image URL to the server for processing
  $.post(
    "/diagnose_specimen",  // Your Flask route
    JSON.stringify({ imageUrl: imageUrl }),
    function (response) {
      // Handle the response from the server
      const predictionElement = $("#prediction");
      const confidenceElement = $("#confidence");
      predictionElement.text(`${response.prediction}`);
      confidenceElement.text(`${response.confidence}%`);
    }
  );
});

// Add an event listener to the "Return to Gallery View" button
const returnToGalleryBtn = document.getElementById("return-to-gallery");

returnToGalleryBtn.addEventListener('click', function () {
  clearPredictionAndConfidence();
});

// Add an event listener to the "Return to Gallery View" button
const closeModalBtn = document.getElementById("close-modal");

closeModalBtn.addEventListener('click', function () {
  clearPredictionAndConfidence();
});

function clearPredictionAndConfidence() {
  var predictionElement = $("#prediction");
  var confidenceElement = $("#confidence");

  // Clear the content for prediction and confidence
  predictionElement.text('');
  confidenceElement.text('');
}

const diagnoseBatchBtn = document.querySelector(".diagnose-batch-btn");
diagnoseBatchBtn.addEventListener("click", () => {
  // TODO: Get all images
  // let imageSources = ["https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0"];
  // const predictingModal = new bootstrap.Modal('.predicting-modal');  
  predictingModal.show();

  let imgs_paths = [];

  const images = document.querySelectorAll(".gallery-container > div > img");
  console.log("images");



  images.forEach(img => {
    imgs_paths.push(img.src);
  });

  console.log("Result:", imgs_paths);

  if (images.length === imgs_paths.length) {
    console.log("SENDING POST REQ");
    message = {
      images_paths: imgs_paths,
      // other_infos: other_infos
    }
    console.log(message);

    fetch("/diagnose_batch", {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => updateLoadingModal());
    // .then((json) => console.log(json));
  }
})



console.log("SEND POST");


// TODO: Save all images in a array
// TODO: Send post req
// });

// const sendPost = () => {
//   $post
// }
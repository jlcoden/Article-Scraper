$(document).ready(function() {
  $(".save-btn").on("click", function(event) {
    var id = $(this).data("id");

    // Send the PUT request.
    $.ajax("/articles/" + id, {
      type: "PUT",
      data: { saved: true }
    }).then(function() {
      // Reload the page to get the updated list
      location.reload();
    });
  });
});

$(document).on("click", "#addNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      if (data.note) {
        $("#notesTitle").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#notesText").val(data.note.body);
      }
    });
});

$(document).on("click", "#saveNote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  });

  // // With that done
  // .then(function(data) {
  //   $("#notes").empty();
  // });

  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});

$(document).on("click", ".delete", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/article/delete/" + thisId
  }).done(function(data) {
    console.log(data);
    window.location = "/saved";
  });
});

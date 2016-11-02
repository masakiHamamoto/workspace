$(document).ready(function() {
  //stolen from http://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
  function getCookie(c_name)
  {
      if (document.cookie.length > 0)
      {
          c_start = document.cookie.indexOf(c_name + "=");
          if (c_start != -1)
          {
              c_start = c_start + c_name.length + 1;
              c_end = document.cookie.indexOf(";", c_start);
              if (c_end == -1) c_end = document.cookie.length;
              return unescape(document.cookie.substring(c_start,c_end));
          }
      }
      return "";
   }

  $.ajaxSetup({
      headers: { "X-CSRFToken": getCookie("csrftoken") }
  });
    var $TABLE = $('#table');
    var $TEMPLATE_ROW = $TABLE.find('tr.hide');
    var references = [{
      "title": "first title",
      "link": "first.link",
      "notes": "This is the first reference",
      "refid": "alk;1mkl;m"
    }, {
      "title": "second title",
      "link": "second.link",
      "notes": "This is the second reference",
      "refid": "kl1m;lm2"

    }];

      $('.table-add').click(addReferenceToServer);
      $('.table-remove').click(function () {
        var refid = getRefIdFromRowElement($(this));
        deleteReferenceOnServer(refid);
        $(this).parents('tr').detach();
      });

    /*  // Turn all existing rows into a loopable array
      $rows.each(function () {
        var $td = $(this).find('td');
        var h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach(function (header, i) {
          h[header] = $td.eq(i).text();
        });

        data.push(h);
      });
        */

  function getRefIdFromRowElement(td) {
    return td.parents('tr').attr("refid");
  }

  function addBlurEventHandler(tableCell) {
    var refid = getRefIdFromRowElement(tableCell);
  }

  function updateReferenceEverywhere(trOfReference) {
    currRef = {};
    currRef["refid"] = trOfReference.attr("refid");
    currRef["title"] = trOfReference.find("td:nth-child(1)").text();
    currRef["link"] = trOfReference.find("td:nth-child(2)").text();
    currRef["notes"] = trOfReference.find("td:nth-child(3)").text();
    var ind = getReferencePositionFromId(currRef["refid"]);
    if(ind != -1) {
      var oldRef = references[ind];
      oldRef["title"] = currRef["title"];
      oldRef["link"] = currRef["link"];
      oldRef["notes"] = currRef["notes"];
    }
    updateReferenceOnServer(currRef);
  }

  function getReferences(success, error) {
    $.get( "/references", function(rawData) {
      if(rawData.error && rawData.error != null) {
        error(rawData.error);
      } else {
        success(rawData.data);
      }
    })
    .fail(error);
  }

  function overwriteReferences(referenceData) {
    references = referenceData;
    clearAllReferences();
    for(var i = 0; i < referenceData.length; i++) {
      var reference = referenceData[i];
      addReferenceToUI(reference);
    }
  }

  function clearAllReferences(){
    $TABLE.slice(1).remove();
  }

  function getEditableTableRow() {
    return $("<td contenteditable='true'></td>");
  }

  function addReferenceToUI(reference) {
    var $clone = $TEMPLATE_ROW.clone(true).removeClass('hide table-line');
    $clone.attr("refid", reference.refid);
    var title = $clone.find("td:nth-child(1)");
    title.text(reference.title);
    var link = $clone.find("td:nth-child(2)");
    link.text(reference.link);
    var notes = $clone.find("td:nth-child(3)");
    notes.text(reference.notes);
    $TABLE.find('table').append($clone);
    addblureventhandlertorow($clone);
  }

  function updateReferences() {
    getReferences(overwriteReferences, console.log);
  }


  function deleteReference(refid) {
    var ind = getReferencePositionFromId(refid);
    if(ind != -1) {
      references.splice(ind, 1);
    }
  }

  function getReferencePositionFromId(refid) {
    var ind = -1;
    var arr = $.grep(references, function(elem, index) {
      console.log(JSON.stringify(elem));
      if(refid === elem.refid) {
        ind = index;
        return true;
      } else {
        return false;
      }
    });
    return ind;
  }

  //DELETE
  function deleteReferenceOnServer(refid) {
      var sendObj = {};
      sendObj["refids"] = [];
      sendObj["refids"].push(refid);
      $.ajax({
          type: "DELETE",
          url: "/references",
          data: JSON.stringify(sendObj),
          success: function(data) {
            deleteReference(refid);
          }
      });
  }

  //GET
  function getReferences(success, error) {
    $.getJSON( "/references", function(rawData) {
      if(rawData.error && rawData.error != null) {
        error(rawData.error);
      } else {
        success(rawData.data);
      }
    })
    .fail(error);
  }

  //PUT
  function addReferenceToServer() {
    var reference = {};
    reference["title"] = "";
    reference["link"] = "";
    reference["notes"] = "";
    $.ajax({
      type: "PUT",
      url: "/references",
      data: JSON.stringify(reference),
      success: function(newRefIdObj) {
        newRefId = newRefIdObj["refid"];
        reference["refid"] = newRefId;
        references.push(reference);
        addReferenceToUI(reference);
      }
    });
  }

  //POST
  function updateReferenceOnServer(reference) {
    $.ajax({
      type: "POST",
      url: "/references",
      data: JSON.stringify(reference),
      success: function() {
        //nothing needs to happen here.
      }
    });
  }

  function addblureventhandler(td) {
    var timer = null;
    td.keyup(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          updateReferenceEverywhere(td.parents('tr'));
        }, 600);
    });
  }

  function addblureventhandlertorow(row) {
    var title = row.find("td:nth-child(1)");
    var link = row.find("td:nth-child(2)");
    var notes = row.find("td:nth-child(3)");
    addblureventhandler(title);
    addblureventhandler(link);
    addblureventhandler(notes);
  };

  updateReferences();
});

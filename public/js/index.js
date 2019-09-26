
  //TABLEAU DES RESULTATS CONCERNANT LES CARACTERES (caractères, pixels, longueur, disponible, ...etc)
  var resObjChar = {thead: {row1:[], row2:[]}, tbody: {row1: [], row2: []}}
  var resObjStatus = [["void", "#000000"], ["✅", "#16C60C"], ["⚠️", "#EA9757"], ["🛑", "#EB6F62"]];
  resObjChar.thead.row1 = ["&nbsp;", ["Caractères", {colspan: 3}], ["Pixels", {colspan: 3}],"&nbsp;"]
  resObjChar.thead.row2 = ["Element", "Longueur", "Affiché", "Tronqué", "Longueur", "Disponible", "Restant", "Statut"]
  resObjChar.tbody.row1 = ["Titre", 0, 0, 0, 0, 0, 0]
  resObjChar.tbody.row2 = ["Description", 0, 0, 0, 0, 0, 0]
  var $myTable = $('<table/>').append($('<thead/>')).append($('<tbody/>'))
  var $myThead = $myTable.find(':first-child')
  var $myTbody = $myTable.find(':last-child')
  for(a in resObjChar.thead){
    let $tr = $('<tr/>')
    $myThead.append($tr)
    for(b in resObjChar.thead[a])
      if(typeof resObjChar.thead[a][b] === 'object')
        $tr.append($('<th/>').attr(resObjChar.thead[a][b][1]).html(resObjChar.thead[a][b][0]))
      else $tr.append($('<th/>').html(resObjChar.thead[a][b]))
  }
  for(a in resObjChar.tbody){
    let $tr = $('<tr/>')
    $myTbody.append($tr)
    for(b in resObjChar.tbody[a])
      if(typeof resObjChar.tbody[a][b] !== 'object')
        $tr.append($('<td/>').html(resObjChar.tbody[a][b]))
      else
        $tr.append($('<td/>').append($('<span/>').attr({"data-status": {color:resObjStatus[0][0]}, style: {color:resObjStatus[0][1]}})))
  }
  $("#visuel--stats").append($myTable)

  //PERMET LE CLIC SUR LES OUTILS DANS LA TOOLBOX(bas de page)
  $(tool_box).on('click', '>div>button', function(){
    $(myModal).addClass('on plus')
    $(myIframe).attr({src: $(this.parentNode).attr('data-url')})
  })


  $("#seo_results .card").on('click', function(e){console.log(e);e.stopPropagation()})
  //PERMET DE QUITTER LE MODE MODAL
  $(seo_results).add(myModal).on('click', function(){$(seo_results).add(myModal).removeClass('on');if(this.className=="plus")$(seo_results).add(myModal).removeClass('plus')})

  //PRE-REMPLIR
  $(inputTitle).bind(
    {paste: function(e) {   alert(e); resTitle.innerHTML = e.target.innerHTML  }},
    {change: function(e) {    resTitle.innerHTML = e.target.innerHTML  }}
  )
  $(inputUrl).bind(
    {paste: function(e) {    resUrl.innerHTML = e.target.innerHTML  }},
    {change: function(e) {    resUrl.innerHTML = e.target.innerHTML  }}
  )
  $(inputMetades).bind(
    {paste: function(e) {    resMetades.innerHTML = e.target.innerHTML  }},
    {change: function(e) {    resMetades.innerHTML = e.target.innerHTML  }}
  )

  //AFFICHER LE RESULTAT DU DIAGNOSTIQUE DANS UN MODAL
  function startPreview() {
    //REND LE MODAL ACTIF A LA VALIDATION
    $(seo_results).add(myModal).addClass('on')

    //RECUPERATION DES VALEUR DU FORMULAIRE
    var seoTitle = inputTitle.value;
    var seoUrl = inputUrl.value;
    var seoMetades = inputMetades.value;

    // Vérification de la longueur du title
    if(seoTitle.length>0) {
      if(seoTitle.length>71) {
        resTitle.innerText = seoTitle.slice(0,70) + "...";
      } else {
        resTitle.innerText = seoTitle;
      }
    }

    // Vérification de la longueur de la meta-description
    if(seoMetades.length>0) {
      if(seoMetades.length>152) {
        resMetades.innerText = seoMetades.slice(0,152) + "...";
      } else {
        resMetades.innerText = seoMetades;
      }
    }

    // Ajout de l'URL
    if(seoUrl.length>0) {
      resUrl.innerText = seoUrl;
    }

    if(seoMetades.length>0 || seoTitle.length>0) {
      evaluateContent(seoTitle, seoUrl, seoMetades);
    }
  }

  function evaluateContent(seoTitle, seoUrl, seoMetades) {
    var alertFormat = ["⚠️", "#EA9757;"];
    var stopFormat = ["🛑", "#EB6F62"];
    var okFormat = ["✅", "#16C60C"];
    var contentScore = 0;

    var recommandations = "";

    if(seoTitle.length<60) {
      recommandations = recommandations + '<li class="alertFormat">' + alertFormat[0] + ' Le title est trop court (' + seoTitle.length + " caractères)</li>";
    } else {
      if (seoTitle.length>71) {
        recommandations = recommandations + '<li class="stopFormat">' + stopFormat[0] + ' Le title est trop long (' + seoTitle.length + " caractères)</li>";
      } else {
        recommandations = recommandations + '<li class="okFormat">' + okFormat[0] + ' Le title a une longueur correcte (' + seoTitle.length + " caractères)</li>";
        contentScore += 50;
      }
    }

    if(seoMetades.length<140) {
      recommandations = recommandations + '<li class="alertFormat">' + alertFormat[0] + ' La meta-description est trop courte (' + seoMetades.length + " caractères)</li>";
    } else {
      if (seoMetades.length>160) {
        recommandations = recommandations + '<li class="stopFormat">' + stopFormat[0] + ' La meta-description est trop longue (' + seoMetades.length + " caractères)</li>";
      } else {
        recommandations = recommandations + '<li class="okFormat">' + okFormat[0] + ' La meta-description a une longueur correcte (' + seoMetades.length + " caractères)</li>";
        contentScore += 50;
      }
    }

    $("#recommandationsPlaceholder>article#advices").html('<div id="r_container"><p>Notre avis :</p><ul> ' + recommandations + '</ul></div>');
    scoreResult.innerText = contentScore + '/100';

    if(contentScore<50) {
      scoreResult.className="stopFormat scoreResult"
    } else {
      if(contentScore>80) {
        scoreResult.className="okFormat scoreResult"
      } else {
        scoreResult.className="alertFormat scoreResult"
      }
    }
  }

  $('html, body').animate({
    scrollTop: $("div#recommandationsPlaceholder").offset().top
  }, 2000);

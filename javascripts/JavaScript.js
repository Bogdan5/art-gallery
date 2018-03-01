$(document).ready(
  let paintings=[];
  let pageNo = 1;
  fetch('https://raw.githubusercontent.com/Bogdan5/art-gallery/master/data.json')
    .then((response)=>{
      if (response.status===200){
        console.log("Data unavailable "+response.status);
        return;
      }
      response.json().then((data)=> {
        let i=0;
        data.map((item,index)=>{
          let obj = Object.assign({},item);
          obj.position = ++i;
          paintings.push(obj));
        };
        fillContainer(1);
      });
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

  const fillContainer = (pageNo)=>{
    paintings.map((item)=>{
      if (item.position>15*(pageNo-1)&&item.position<=15*pageNo){
        $("#thumbs-container").append('<div id=\"card'+item.position+'\"></div>');
        $("#card"+item.position).addClass("col-lg-4 col-md-6 col-sm-12 card")
          .append('<img src=\"'+item.url+'\"/>').append('<div class=\"card-title\">'+item.author+'</div>')
          .append('<div class=\"card-title\">'+item.title+'</div>');
      }

    })
  }
);

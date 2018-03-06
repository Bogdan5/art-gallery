$(document).ready(
  let paintings=[];
  let pageNo = 1;
  let currPage=1;
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
        addListeners();
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

  const pageManager=(pageNo)=>{
    const dots = '<div class="dots">...<div>';
    const contain = $('#pages-container');
    $('.first-page').on('click',()=>fillContainer(1));

    if (paintings.length<16){
      contain.children().not('.first-page').addClass('.no-display');
      return;
    } else {
      $('.second-page').on('click',()=>fillContainer(2));
      if (paintings.length<31){
       contain.children().not('.first-page,.second-page').addClass('.no-display');

       return;
      }
    }

  }

  const lastPage=()=>Math.ceil(paintings.length/15);

  }
  const addListeners=()=>{
    $('.first-page').on('click',()=>fillContainer(1));
    $('.last-page').on('click',()=>fillContainer(lastPage));

    $("#page-container").children().not('.dots').on('click',()=>{
      const text = $(this).text();
      if (Number(text)){
        fillContainer(text);
      } else {
        if (text==='>'){
          fillContainer(pageNo+1);
        } else {
          fillContainer(pageNo-1);
        }
      }
    })
  }
);

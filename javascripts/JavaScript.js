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
    const last = lastPage();

    //gives number values to each page number div
    const centralPages = (pageNo)=>{
      if (last<4 || pageNo===1){
        assigner([1,2,3]);
      } else if (pageNo===last){
        assigner([pageNo-2,pageNo-1,pageNo]);
      } else {
        assigner([pageNo-1, pageNo, pageNo+1]);
      }
    }
    //helper function for centralPages
    const assignerNumber = (arr)=>{
      $('.first-page').text(arr[0]);
      $('.second-page').text(arr[1]);
      $('.third-page').text(arr[2]);
    }

    const visibility = (pageNo)=>{
      if (last===1){
        assignerVisibility(false, false, true, false, false, false, false);
      } else if (last===2){
        assignerVisibility(true, false, true, true , false, false, true);
      } else if 
    }

    const assignerVisibility=(prev, dots1, one, two, three, dots2, next)=>{
      prev && $('.previous').addClass('.no-display');
      dots1 && $('.dots1').addClass('.no-display');
      one && $('.first-page').addClass('.no-display');
      two && $('.second-page').addClass('.no-display');
      three && $('.third-page').addClass('.no-display');
      dots2 && $('.dots2').addClass('.no-display');
      next && $('.next').addClass('.no-display');
    }
    if (last===1){
      contain.children().not('.first-page').addClass('.no-display');
      $('.first-page').on('click',()=>fillContainer(1));
    }
    if (last===2){
      $('.third-page').addClass('.no-display');
      $('.first-page').on('click',()=>fillContainer(1));
      $('.second-page').on('click',()=>fillContainer(2));
    }
    if (last===3){
      constain.children().not('first-page, .second-page, .third-page').addClass('.no-display');

    }
    $('.first-page').on('click',()=>fillContainer(1));

    if (paintings.length<31){
      contain.children().not('.first-page').addClass('.no-display');
      if (paintings.length<16){}
    }
    if (paintings.length<16){
      contain.children().not('.first-page').addClass('.no-display');
      return;
    }
    if (paintings.length<31) {
      $('.second-page').on('click',()=>fillContainer(2));
      return;
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

$(document).ready(()=>{
  let paintings=[];
  let pageNo = 1;
  let currPage=1;

  fetch('https://raw.githubusercontent.com/Bogdan5/art-gallery/master/data.json')
    .then((response)=>{
      if (response.status!==200){
        console.log("Data unavailable "+response.status);
        return;
      }
      response.json().then((data)=> {
        let i=0;
        data.map((item,index)=>{
          let obj = Object.assign({},item);
          obj.position = ++i;
          paintings.push(obj);
        });

        $('.first-page').on('click',()=>{
          fillContainer(1);
          pageManager(1);
        });
        $('.previous').on('click',()=>{
          fillContainer(--pageNo);
          pageManager(--pageNo);
        });
        $('.page-first').on('click',()=>{
          fillContainer(--pageNo);
          pageManager(--pageNo);
        });
        $('.page-third').on('click',()=>{
          fillContainer(pageNo++);
          pageManager(pageNo++);
        });
        $('.next').on('click',()=>{
          fillContainer(pageNo++);
          pageManager(pageNo++);
        });
        $('.last-page').on('click',()=>{
          fillContainer(lastPage);
          pageManager(lastPage);
        });

        fillContainer(1);
        pageManager(1);
      });
    })
    .catch((err)=> {
      console.log('Fetch Error :-S', err);
    });

  const lastPage=()=>Math.ceil(paintings.length/15);
  const eventAdder = (obj)=>{
    return ()=>{
      console.log(obj.id);
      $('.viewer').empty().append('<img src=\"'+obj.url+'\"/>')
      .append('<div>Author: '+obj.author+'</div>')
      .append('<div>Title:'+obj.title+'</div>')
      .append('<div>Type:'+obj.type+'</div>')
      .append('<div>Year:'+obj.year+'</div>')
      .append('<div>Reserve:'+obj.reserve+'</div>');
    }
  }
  const fillContainer = (pageNo)=>{
    paintings.map((item)=>{
      if (item.position>15*(pageNo-1)&&item.position<=15*pageNo){
        $("#thumbs-container").append('<div id=\"card'+item.position+'\"></div>');
        $("#card"+item.position).addClass("col-lg-4 col-md-6 col-sm-12 card")
          .append('<img src=\"'+item.url+'\"/>').append('<div class=\"author-card\">'+item.author+'</div>')
          .append('<div class=\"title-card\">'+item.title+'</div>');
          $('#card'+item.id).on('click',eventAdder(item));
      }
    });
  }

  const pageManager=(pageNo)=>{
    const dots = '<div class="dots">...<div>';
    const contain = $('#pages-container');
    const last = lastPage();

    //gives number values to each page number div
    const centralPages = (pageNo)=>{
      if (last<4 || pageNo===1){
        assignerNumber(1,2,3);
      } else if (pageNo===last){
        assignerNumber([pageNo-2,pageNo-1,pageNo]);
      } else {
        assignerNumber([pageNo-1, pageNo, pageNo+1]);
      }
    }
    //helper function for centralPages
    const assignerNumber = (...arr)=>{
      console.log(arr);
      $('.page-first').text(arr[0]);
      $('.page-second').text(arr[1]);
      $('.page-third').text(arr[2]);
    }

    const visibility = (pageNo)=>{
      if (last===1){
        assignerVisibility(false, false, true, false, false, false, false);
      } else if (last===2){
        if (pageNo===1){
          assignerVisibility(false, false, true, true , false, true, true);
        } else {
          assignerVisibility(true, false, true, true , false, true, false);
        }
      } else {
        if (pageNo===1){
          if (last>3){
            assignerVisibility(false,false, true, true, true, true, true);
          } else {
            assignerVisibility(false, false, true, true, true, false, true);
          }
        } else if (pageNo===last){
          if (last>3){
            assignerVisibility(true, true, true, true, true, false, false);
          } else {
            assignerVisibility(true, false, true, true, true, false, false);
          }
        } else{
          assignerVisibility(true, true, true, true , true, true, true);
        }
      }
    }
    // helper function for visibility - hides or reveals the pages buttons -
    const assignerVisibility=(prev, dots1, one, two, three,dots2,next)=>{
      if (prev){
        $('.previous').removeClass('.no-display');
      } else {
        $('.previous').addClass('.no-display');
      }
      if (dots1){
        $('.dots1').removeClass('.no-display');
      } else {
        $('.dots1').addClass('.no-display');
      }
      if (one){
        $('.first-page').removeClass('.no-display');
      } else {
        $('.first-page').addClass('.no-display');
      }
      if (two){
        $('.second-page').removeClass('.no-display');
      } else{
        $('.second-page').addClass('.no-display');
      }
      if (three){
        $('.third-page').removeClass('.no-display');
      } else {
        $('.third-page').addClass('.no-display');
      }
      if (dots2){
        $('.dots2').removeClass('.no-display');
      } else {
        $('.dots2').addClass('.no-display');
      }
      if (next){
        $('.next').removeClass('.no-display');
      } else {
        $('.next').addClass('.no-display');
      }
    }
    centralPages(pageNo);
    visibility(pageNo);
  }
});

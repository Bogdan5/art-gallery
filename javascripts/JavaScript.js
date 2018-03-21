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


        fillContainer(1);
        eventPages(pageNo);
      });
    })
    .catch((err)=> {
      console.log('Fetch Error :-S', err);
    });

  const lastPage=()=>Math.ceil(paintings.length/15);
  const eventAdder = (obj)=>{
    return ()=>{
      $('.viewer').empty().append('<img src=\"'+obj.url+'\"/>')
      .append('<div>Author: '+obj.author+'</div>')
      .append('<div>Title:'+obj.title+'</div>')
      .append('<div>Type:'+obj.type+'</div>')
      .append('<div>Year:'+obj.year+'</div>')
      .append('<div>Reserve:'+obj.reserve+'</div>');
    }
  }
  const fillContainer = (pageNo)=>{
    pageManager(pageNo);
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

  const eventPages = (pageNo)=>{
    console.log('evP');
    $('#first-page').on('click',()=>{
      fillContainer(1);
      pageManager(1);
    });
    $('#previous').on('click',()=>{
      fillContainer(--pageNo);
      pageManager(--pageNo);
    });
    $('#page-first').on('click',()=>{
      fillContainer(--pageNo);
      pageManager(--pageNo);
    });
    $('#page-third').on('click',()=>{
      fillContainer(pageNo++);
      pageManager(pageNo++);
    });
    $('#next').on('click',()=>{
      fillContainer(pageNo++);
      pageManager(pageNo++);
    });
    $('#last-page').on('click',()=>{
      fillContainer(lastPage);
      pageManager(lastPage);
    });

  }

  const pageManager=(pageNo)=>{
    const dots = '<div class="dots">...<div>';
    const contain = $('#pages-container');
    const last = lastPage();

    //gives number values to each page number div
    const centralPages = (pageNo)=>{
      if (last<4 || pageNo===1){
        console.log('numbers');
        assignerNumber(1,2,3);
      } else if (pageNo===last){
        assignerNumber([pageNo-2,pageNo-1,pageNo]);
      } else {
        assignerNumber([pageNo-1, pageNo, pageNo+1]);
      }
    }
    //helper function for centralPages
    const assignerNumber = (...arr)=>{
      $('#page-first').text(arr[0]);
      $('#page-second').text(arr[1]);
      $('#page-third').text(arr[2]);
    }

    const visibility = (pageNo)=>{
      if (last===1){
        assignerVisibility(false, false, false, true, false, false, false, false, false);
      } else if (last===2){
        if (pageNo===1){
          assignerVisibility(false, false, false, true, true , false, true, true);
        } else {
          assignerVisibility(true, true, false, true, true , false, false, false, false);
        }
      } else if (last === 3) {
        if (pageNo===1){
          assignerVisibility(false, false, false, true, true, true, true, true, true);
        } else if (pageNo === last){
          assignerVisibility(true,true,false,true,true,true,false,false,false);
        } else {
          assignerVisibility(true,true,false,true,true,true,false,true,true);
        }
      } else {
        if (pageNo===1){
          assignerVisibility(false,false,false, true, true, true, true, true, true);
        } else if (pageNo===last){
          assignerVisibility(true,true,true,true,true,true,false,false,false);
        } else if (pageNo===2){
          assignerVisibility(true,true,false,true,true,true,true,true,true);
        } else if (pageNo===last-1){
          assignerVisibility(true,true,true,true,true,true,false,true,true);
        } else {
          assignerVisibility(true,true,true,true,true,true,true,true,true);
        }
      }
    }
    // helper function for visibility - hides or reveals the pages buttons -
    const assignerVisibility=(...arg)=>{
      $('#pages-container>div').each((index,el)=>{
        if (arg[index]){
          $(el).removeClass('no-display');
        } else {
          $(el).addClass('no-display');
        }
      });
    }

    centralPages(pageNo);
    visibility(pageNo);
  }
});

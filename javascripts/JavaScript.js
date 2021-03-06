$(document).ready(() => {
  fetch('https://raw.githubusercontent.com/Bogdan5/art-gallery/master/data.json')
    .then((response)=> {
      let paintings = [];
      if (response.status !== 200) {
        console.log('Data unavailable ' + response.status);
        return;
      }

      response.json().then((data)=> {
        data.map((item, index) => {
          let obj = Object.assign({}, item);
          paintings.push(obj);
        });

        // console.log(paintings);
        displayManager(paintings, 1);
        searchManager(paintings);
      });
    })
    .catch((err)=> {
      console.log('Fetch Error :-S', err);
    });
});

//displays the cards container and pagenumbers for a specific data set and pageNo
const displayManager = (paintings, pageNo) => {
  const lastPage = () => Math.ceil(paintings.length / 15);

  const fillContainer = (paintings, pageNo) => {

    //helper function that returns a function for adding click events on painting cards
    const eventAdder = (obj) => {
      return () => {
        console.log(obj.id, 'clicked');
        $('.viewer').empty().append('<img src=\"' + obj.url + '\"/>')
        .append('<div>Author: ' + obj.author + '</div>')
        .append('<div>Title: ' + obj.title + '</div>')
        .append('<div>Type: ' + obj.type + '</div>')
        .append('<div>Year: ' + obj.year + '</div>')
        .append('<div>Reserve: ' + obj.reserve + '</div>')
        .append('<button type="button" class="btn btn-primary" data-toggle="modal"' +
        'data-target="#modalDiv">More information</button>');
      };
    };

    //clears the container and fills it with cards for each painting
    $('#thumbs-container').empty();
    let i = 0;
    paintings.map((item) => {
      item.position = ++i;
      if (item.position > 15 * (pageNo - 1) && item.position <= 15 * pageNo) {
        console.log('s');
        $('#thumbs-container').append('<div id=\"card' + item.position + '\"></div>');
        $('#card' + item.position).addClass('col-lg-4 col-md-6 col-sm-12 card')
          .append('<img src=\"' + item.url + '\"/>').append('<div class=\"author-card\">'
          + item.author + item.id + '</div>')
          .append('<div class=\"title-card\">' + item.title + '</div>');
        $('#card' + item.position).unbind('click').on('click', eventAdder(item));
      }
    });
    pageManager(pageNo);
  };

  //manages page buttons establishes visibility and binds events
  const pageManager = (pageNo) => {
    console.log('pageManager', paintings.length, pageNo);
    const last = lastPage();

    //gives number values to each page number div
    const centralPages = (pageNo) => {
      //helper function for centralPages - add page numbers to buttons
      const assignerNumber = (...arr) => {
        $('#page-first').text(arr[0]);
        $('#page-second').text(arr[1]);
        $('#page-third').text(arr[2]);
      };

      if (last < 4 || pageNo === 1) {
        assignerNumber(1, 2, 3);
      } else if (pageNo === last) {
        assignerNumber(pageNo - 2, pageNo - 1, pageNo);
      } else {
        assignerNumber(pageNo - 1, pageNo, pageNo + 1);
      }
    };

    const visibility = (pageNo) => {
      const positionVisibility = (...arg) => {
        const isVisible = arg.shift();
        arg.map((el) => {
          if (isVisible) {
            $('#pages-container>div').eq(el).removeClass('no-display');
          } else {
            $('#pages-container>div').eq(el).addClass('no-display');
          }
        });
      };

      positionVisibility(true, 3);
      positionVisibility(!(pageNo === 1 || last === 1), 0, 1);
      positionVisibility(!(pageNo === last || last === 1), 7, 8);
      positionVisibility(pageNo > 2, 2);
      positionVisibility(pageNo < last - 2, 6);
      positionVisibility(last > 1, 4);
      positionVisibility(last > 2, 5);
    };

    const pageColours = (pageNo) => {
      let select;
      if (last === 1 || pageNo === 1) {
        select = 'first';
      } else if (last > 2 && pageNo === last) {
        select = 'third';
      } else {
        select = 'second';
      }

      $('#page-' + select).addClass('pages-pressed');
      $('div[id ^= "page-"]').not('#page-' + select).removeClass('pages-pressed');
    };

    //adds events listeners for all buttons of the page numbers
    const eventPages = (paintings, pageNo) => {
      $('#first-page').on('click', () => {
        fillContainer(paintings, 1);
      });
      $('#previous').on('click', () => {
        fillContainer(paintings, --pageNo);
      });
      $('#page-first').on('click', () => {
        if (pageNo !== 1) {
          fillContainer(paintings, --pageNo);
        }
      });
      $('#page-second').on('click', () => {
        if (pageNo === 1) {
          fillContainer(paintings, ++pageNo);
        } else if (pageNo === lastPage()) {
          fillContainer(paintings, --pageNo);
        }
      });
      $('#page-third').on('click', () => {
        if (pageNo !== lastPage()) {
          if (pageNo === 1) {
            pageNo += 2;
          } else {
            pageNo++;
          }

          fillContainer(paintings, pageNo);
        }
      });
      $('#next').on('click', () => {
        fillContainer(paintings, pageNo++);
      });
      $('#last-page').on('click', () => {
        fillContainer(paintings, lastPage());
      });
    };

    centralPages(pageNo);
    visibility(pageNo);
    pageColours(pageNo);
    eventPages(paintings, pageNo);
  };

  fillContainer(paintings, pageNo);
};

const searchManager = (paintings) => {
  let word = '';
  let opt = '';
  let order = '';
  let filtered = paintings.slice();

  const searcher = () => {
    if (term) {
      if (opt === '0') {
        filtered = filtered.filter((el) => Object.values(el).reduce((acc, elem, index) =>
          acc || ([1, 2, 3, 4].includes(index) ? word.test(elem) : false), false));
      } else {
        filtered = filtered.filter(el => word.test(Object.values(el)[parseInt(opt, 10)]));
      }
    } else {
      filtered = paintings;
    }
  };

  const ordering = () => {
    if (order !== '0') {
      filtered = filtered.sort((a, b) => {
        let a1 = a[order] + '';
        let b1 = b[order] + '';
        return a1.localeCompare(b1);
      });
    }

    console.log(filtered);
    displayManager(filtered, 1);
  };

  //filtered is the array with all the cards that fit the search terms and type
  $('#searchTerm').on('input', (event) => {
    // let filtered = paintings.slice();
    term = $(event.currentTarget).val();
    word =  new RegExp(term, 'i');
    opt = $('#typeSearch').val();
    searcher();
    ordering();
  });

  $('#typeSearch').on('change', (event) => {
    opt = $(event.currentTarget).val();
    searcher();
    ordering();
  });

  $('#ordering').on('change', ev => {
    order = $(event.currentTarget).val() + '';
    ordering();
  });
};

(($)=> {
    console.log('hi');

    function isLoggedIn() {
        return !!document.body.querySelector('.sbidbidder input');
    }
    const REVIEW = document.body.querySelector('#SubmitBids input[name="review"]').value | 'Review Bids';

    const ERROR_MSG = 'does not exist on this server or required files are missing.';

    let bidder = document.body.querySelector('#SubmitBids input[name="bidder"]').value
      , password = document.body.querySelector('#SubmitBids input[name="password"]').value
      , auction = document.body.querySelector('#SearchArea form[name="searchform"] input[name="auction"]').value
      , item = document.body.querySelector('#SelectCat input[name="item"]').value;

    let user = {
        id: bidder,
        password: password
    };

    function requestDataTableElementForItem(user, auction, item) {
        let data = {
            auction: auction,
            contents: item + '/',
            bidder: user.id,
            password: user.password,
            review: REVIEW
        }
        data[item] = '';
        data['m' + item] = '';

        return $.ajax({
            method: 'POST',
            url: 'https://bid.cannonsauctions.com/cgi-bin/mmlistb.cgi',
            data: data
        }).then((data,textStatus,jqXHR)=>{
            let div = window.document.createElement('div');

            div.innerHTML = data;

            if (div.textContent.trim() === ERROR_MSG) {
                throw new Error('Request Error');
            }

            return div.querySelector('#DataTable');
        }
        );
    }

    function updateDataTable(dataTableDiv, dataTableId='#DataTable') {
        let currentDataTable = window.document.body.querySelector(dataTableId);

        currentDataTable.innerHTML = dataTableDiv.innerHTML;
        return dataTableDiv;
    }

    function colorHighBidder(bidder) {
        let highBidderElement = window.document.body.querySelector('#DataTable td.highbidder')
          , currentHighBidder = highBidderElement.textContent.trim();

        if (currentHighBidder !== bidder) {
            highBidderElement.style.color = 'red';
        } else {
            highBidderElement.style.color = 'black';
        }

        return highBidderElement;
    }

    function requestAllActions(url) {
        url = url || 'https://bid.cannonsauctions.com/cgi-bin/mmcal.cgi?redbird';

        return $.ajax({
            method: 'GET',
            url: url
        }).then((data)=>{
            let div = document.createElement('div');
            div.innerHTML = data;
            return Array.prototype.reduce.call(div.querySelectorAll('table td.anotes a'), (accum,v)=>{
                accum.push(v.href.split('?')[1]);
                return accum
            }
            , []);
        }
        )

    }

    requestDataTableElementForItem(user, auction, item).then(updateDataTable).then(()=>{
        colorHighBidder(bidder);
    });

    window.setInterval(()=>{
        console.log('refreshing');
        requestDataTableElementForItem(user, auction, item).then(updateDataTable).then(()=>{
            colorHighBidder(bidder);
        });
    }, 5 * 1000)
})(jQuery);

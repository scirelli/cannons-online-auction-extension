/* exported ItemDetailsPage */
let ItemDetailsPage = (User, Item)=> {
    return ItemDetailsPage;

    class ItemDetailsPage {
        constructor(bodyElem) {
            this.bodyElem = bodyElem;
            this.user = new User();
            this.item = new Item();
            this.active = false;
            this.intervalID = null;
        }
        
        static URL = 'https://bid.cannonsauctions.com/cgi-bin/mmlistb.cgi';
        static REVIEW = 'Review Bids';
        static ERROR_MSG = 'does not exist on this server or required files are missing.';

        init() {
            this.REVIEW = this.getReviewStr();
            this.user = this.getUser();
            this.auction = this.getAuctionStr();
            this.item = this.getItem();
        }

        isLoggedIn() {
            return this.user.isLoggedIn;
        }

        activate() {
        }

        deactivate() {
        }

        autoLoad() {
            this.activate();
        }

        getItem() {
            return new Item(this.bodyElem.querySelector('#SelectCat input[name="item"]').value);
        }

        getUser() {
            return new User(this.bodyElem.querySelector('#SubmitBids input[name="bidder"]').value,
                this.bodyElem.querySelector('#SubmitBids input[name="password"]').value,
                this.bodyElem.querySelector('.sbidbidder input'));
        }

        getReviewStr() {
            return this.bodyElem.querySelector('#SubmitBids input[name="review"]').value | ItemDetailsPage.REVIEW;
        }

        getAuctionStr() {
            return this.bodyElem.querySelector('#SearchArea form[name="searchform"] input[name="auction"]').value;
        }
    }

    function requestDataTableElementForItem(user, auction, item) {
        item = item.id;

        let data = {
                auction: auction,
                contents: item + '/',
                bidder: user.id,
                password: user.password,
                review: REVIEW
            };

        data[item] = '';
        data['m' + item] = '';

        return $.ajax({
            method: 'POST',
            url: ItemDetailsPage.URL,
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
};

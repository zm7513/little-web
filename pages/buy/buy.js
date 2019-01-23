var app = getApp();
var Api = require("../../utils/util.js");   

Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    hidden:true ,  //弹出框隐藏
    list:[]     , //请求的数据
    data:{}      ,//请求数据回来的单个数据
    page: 1,
    psize:20,
    inOut: "进",
    orgCat: "国股",
    priceAsc:"",
    valueAsc:'',
    expireYear:'',
    url: 'https://www.360yipiao.com/tty/little/ebill/list',
    hd1:false,
    hd2:true,
    hd3:false,
    hd4:true,
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    Height:0 ,
    ColorChange: true, scrollTop: 0,
    scrollHeight: 0,
    showDialog:false,
    selectArray: [{
      "id": "1",
      "text": "价格(升)"
    }, {
      "id": "2",
      "text": "价格(降)"
      }, {
        "id": "3",
        "text": "不限"
      }]
      , selectValue: [{
        "id": "1",
        "text": "金额(升)"
      }, {
        "id": "2",
        "text": "金额(降)"
      }, {
        "id": "3",
        "text": "不限"
      }]
      , selectYear: [{
        "id": "1",
        "text": "一年"
      }, {
        "id": "2",
        "text": "半年"
      }, {
        "id": "3",
        "text": "不限"
      }],
    show: false,                   //控制下拉列表的显示隐藏，false隐藏、true显示
    show1: false,                   //控制下拉列表的显示隐藏，false隐藏、true显示
    show2: false,                   //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['价格(升)', '价格(降)', '不限'],   //下拉列表的数据
    selectData2: ['金额(升)', '金额(降)', '不限'],   //下拉列表的数据
    selectData3: ['一年', '半年','不限'],   //下拉列表的数据
    index: 0                       //选择的下拉列表下标
   
  },
  // .........................................................................
  selectTapprice() {
    this.setData({
      show: !this.data.show,
      show1:false,
      show2:false
    });
  },
  // 点击下拉列表
  optionTapprice(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    if (Index == 0) {
      this.setData({ priceAsc: true, page: 1, list: [] })
      this.res()
      // console.log(e.detail)
    } else if (Index == 1) {
      this.setData({ priceAsc: false, page: 1, list: [] })
      this.res()
      // console.log(this.data.list)
    } else {
      this.setData({ priceAsc: '', page: 1, list: [] })
      this.res();
    }
    this.setData({
      index: Index,
      show:!this.data.show,
    });
  },
  // ................................................................................
  selectTapvalue() {
    this.setData({
      show1: !this.data.show1,
      show:false,
      show2:false
    });
  },
  // 点击下拉列表
  optionTapvalue(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    if (Index == 0) {
      this.setData({ valueAsc: true, page: 1, list: [] })
      this.res()
      // console.log(e.detail)
    } else if (Index == 1) {
      this.setData({ valueAsc: false, page: 1, list: [] })
      this.res()
      // console.log(e.detail)
    } else {
      this.setData({ valueAsc: '', page: 1, list: [] })
      this.res()
      // console.log(e.detail)    
    }
    this.setData({
      index: Index,
      show1: !this.data.show1
    });
  },
  // ....................................................................................
  selectTapdate() {
    this.setData({
      show2: !this.data.show2,
      show:false,
      show1:false
    });
  },
  // 点击下拉列表
  optionTapdate(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    if (Index == 0) {
      this.setData({ expireYear: "一年", page: 1, list: [] })
      this.res()
      console.log(this.data.list)
      // console.log(e.detail)
    } else if (Index == 1) {
      this.setData({ expireYear: "半年", page: 1, list: [] })
      this.res()
      // console.log(e.detail)
    } else {
      this.setData({ expireYear: '', page: 1, list: [] })
      this.res()
      // console.log(e.detail)    
    }
    this.setData({
      index: Index,
      show2: !this.data.show2
    });
  },
//清除下拉框
  changeOption:function(){
    this.setData({
      show:false,
      show1:false,
      show2:false
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
    if (e.detail.current == "0") {
      that.setData({ orgCat: '国股',page:1 ,list:[]})
      that.res()
    } else if (e.detail.current == "1") {
      that.setData({ orgCat: '城商', page: 1 ,list:[]})
      that.res()
    } else if (e.detail.current== "2") {
      that.setData({ orgCat: '农商', page: 1 ,list:[] })
      that.res()
    }
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true,
      list:[]
    })
  
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this
    //数据请求
    setTimeout(function () {
      // complete
      that.setData({ page: 1})
      // console.log(that.data.page)
      that.res()
      that.setData({ isRefreshing: false})
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //上拉加载
  bindDownLoad: function () {
    var that = this;
    var currentTab = that.data.currentTab
    if (currentTab == "0") {
      that.setData({ page: this.data.page + 1, orgCat: "国股" })
      // console.log(this.data.page)
      this.res()
      // console.log(this.data.list)
      var list = this.data.list
      for (let i = 0; i < this.data.length; i++) {
        list.push(this.data.list[i])
      }
      that.setData({ list: list })

    } else if (currentTab == "1") {
      that.setData({ page: this.data.page + 1, orgCat: "城商" })
      console.log(this.data.page)
      this.res()
      var list = this.data.list
      for (let i = 0; i < this.data.length; i++) {
        list.push(this.data.list[i])
      }
      that.setData({ list: list })
      // console.log(1)

    } else if (currentTab == "2") {
      that.setData({ page: this.data.page + 1, orgCat: "农商" })
      console.log(this.data.page)
      this.res()
      var list = this.data.list
      for (let i = 0; i < this.data.length; i++) {
        list.push(this.data.list[i])
      }
      that.setData({ list: list })
      }

  },
  lower:function(){
    // var that = this
    //   that.setData({page:this.data.page+1})
    //   // console.log(this.data.page)
    //   that.res()
    //   var list = this.data.list.concat(this.data.list)
    //   that.setData({list:list})
    //   console.log(this.data.list)
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });

  },
  // onReachBottom:function(){
  //   var that= this
  //   // if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
  //   //   return
  //   // }
  //   // that.setData({
  //   //   isLoadingMoreData: true,page:this.data.page+1
  //   // })
  //   // var that = this
  //   // console.log(this.data.page)

  //   var currentTab = that.data.currentTab
  //   if (currentTab == "0") {
  //   that.setData({ page: this.data.page+1 ,orgCat:"国股"})
  //     console.log(this.data.page)
  //   this.res()
  //   console.log(this.data.list)
  //   var list = this.data.list
  //   for(let i=0;i<this.data.length;i++){
  //     list.push(this.data.list[i])
  //   }
  //   that.setData({list:list})
     
  //   } else if (currentTab == "1") {
  //     that.setData({ page: this.data.page+1, orgCat:"城商" })
  //     console.log(this.data.page)
  //     this.res()
  //     var list = this.data.list
  //     for (let i = 0; i < this.data.length; i++) {
  //       list.push(this.data.list[i])
  //     }
  //     that.setData({ list: list })
  //     // console.log(1)

  //   } else if (currentTab == "2") {
  //     that.setData({ page: this.data.page+1, orgCat: "农商" })
  //     console.log(this.data.page)
  //     this.res()
  //     var list = this.data.list
  //     for (let i = 0; i < this.data.length; i++) {
  //       list.push(this.data.list[i])
  //     }
  //     that.setData({ list: list })
  //     // console.log(2)

  //   }
  // //     // that.setData({list:list})
  // //     // console.log(this.data.list)
  
   
  // },

  sortChange:function(){
    this.setData({ColorChange:false})
    this.setData({ hd1: !this.data.hd1, hd4: !this.data.hd4, hd2: !this.data.hd2, hd3: !this.data.hd3 })
    this.setData({ priceAsc:!this.data.priceAsc, page: 1,list:[] })
    var list = this.data.list
    this.res()
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //弹出框显示及发送相对应的请求
  showmodel: function (e) {
    var that = this;
    // console.log(this.data.currentTab)
    let currentTab = this.data.currentTab
    // console.log("弹出框", currentTab);
    if (this.data.currentTab == '0') {

      wx.request({
        url: 'https://www.360yipiao.com/tty/little/ebill/list?page=1&psize=300&inOut=进&orgCat=国股&priceAsc=false',
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          let index = e.currentTarget.dataset.index
          let datas = res.data.body
          let data = datas[index]

          that.setData({
            showDialog: !that.data.showDialog,
            index: e.currentTarget.dataset.index,
            data: data,
          })
          // console.log(datas)
        },
      })

    } else if (currentTab == "1") {
      wx.request({
        url: 'https://www.360yipiao.com/tty/little/ebill/list?page=1&psize=300&inOut=进&orgCat=城商&priceAsc=false',
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          let index = e.currentTarget.dataset.index
          let datas = res.data.body
          let data = datas[index]

          that.setData({
            showDialog: !that.data.showDialog,
            index: e.currentTarget.dataset.index,
            data: data,
          })
          // console.log(data)
        },
      })
    } else if (currentTab == "2") {
      wx.request({
        url: 'https://www.360yipiao.com/tty/little/ebill/list?page=1&psize=300&inOut=进&orgCat=农商&priceAsc=false',
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          let index = e.currentTarget.dataset.index
          let datas = res.data.body
          let data = datas[index]

          that.setData({
            showDialog: !that.data.showDialog,
            hidden: false,
            index: e.currentTarget.dataset.index,
            data: data,
          })
          // console.log(data)
        },
      })
    }

  },
  //弹出框隐藏
  call: function (e) {
    var that = this
    wx.makePhoneCall({

      phoneNumber: that.data.data.phone,
    })
    this.setData({ showDialog: !this.data.showDialog })
  },
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },
  // sortTop:function(){
  //   this.setData({hd1:true,hd4:false,hd2:true,hd3:false})
  //   this.setData({ priceAsc:false,page:1})
  //   // var list = this.data.list
  //   this.res()


  // },
  // sortSlow:function(){
  //   this.setData({hd3:true,hd2:false,hd4:true,hd1:false})
  //   // this.setData({ priceAsc: true })    
  //   this.setData({ priceAsc: true ,page:1})
  //   // var list = this.data.list
  //   this.res()
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //请求数据
    this.res()
  },
  footerTap: app.footerTap,
  //请求数据函数
  res: function (page = this.data.page, psize = this.data.psize, inOut = this.data.inOut, orgCat = this.data.orgCat, priceAsc = this.data.priceAsc, valueAsc = this.data.valueAsc, expireYear=this.data.expireYear) {
    // 发送请求
    var that = this
    wx.request({
      url: this.data.url,
      data: {
        page,
        psize,
        inOut,
        orgCat,
        priceAsc,
        valueAsc,
        expireYear,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var list = that.data.list
        // console.log(datas)
        //判断数据的是否为空
        // 时间戳转为日期
        for (let i = 0; i < res.data.body.length; i++) {
          res.data.body[i]["createTime"] = Api.formatDate(res.data.body[i]["createTime"]);
          if(res.data.body[i].price==undefined){
            res.data.body[i]["price"]='--'
          }
          if (res.data.body[i].value == undefined) {
            res.data.body[i]["value"] = "--"
          } 
          
          // else {
          //   that.setData({price:res.data.body[i].price})
          // }
          
          list.push(res.data.body[i])
          // console.log(datas[i])
        }
        that.setData({ list: list })
        // console.log(that.data.list)

      },
    })

  },
  
  
})

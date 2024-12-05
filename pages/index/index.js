// index.js
Page({
  data: {
    totalCount: 0,
    progress: 0,
    currentCount: 0,
    isAnimating: false,
    isShaking: false,
    showRedPackets: false,
    redPackets: [],
    floatingTips: [],
    tipId: 0,
  },

  onLoad() {
    // 创建音频上下文
    this.audioCtx = wx.createInnerAudioContext();
    this.audioCtx.src = '/audio/woodfish.mp3';
    
    // 初始化红包雨数组
    this.initRedPackets();
  },

  addFloatingTip() {
    const tipId = this.data.tipId + 1;
    // 固定在木鱼上方显示
    const newTip = {
      id: tipId,
      x: '50%',
      y: '45%' // 位于屏幕中间偏上位置
    };
    
    this.setData({
      floatingTips: [...this.data.floatingTips, newTip],
      tipId: tipId
    });

    setTimeout(() => {
      const tips = this.data.floatingTips.filter(tip => tip.id !== newTip.id);
      this.setData({
        floatingTips: tips
      });
    }, 1000);
  },

  onTapWoodfish() {
    // 添加浮动提示
    this.addFloatingTip();
    
    // 只在普通点击时震动
    wx.vibrateShort();
    
    // 更新总功德数
    let newTotalCount = this.data.totalCount + 1;
    // 更新当前周期计数
    let newCurrentCount = this.data.currentCount + 1;
    // 计算进度
    let newProgress = (newCurrentCount / 66) * 100;
    
    // 点击动画
    this.setData({ isAnimating: true });
    setTimeout(() => {
      this.setData({ isAnimating: false });
    }, 200);
    
    // 检查是否达到66次
    if (newCurrentCount >= 66) {
      this.triggerRedPacketRain();
      newCurrentCount = 0; // 只重置当前周期计数
      newProgress = 0;     // 重置进度条
      // 播放音乐
      this.audioCtx.play();
      // 10秒后停止音乐
      setTimeout(() => {
        this.audioCtx.stop();
      }, 10000);
    }
    
    this.setData({
      totalCount: newTotalCount,     // 总功德数继续累加
      currentCount: newCurrentCount, // 重置当前周期计数
      progress: newProgress         // 重置进度条
    });
  },

  initRedPackets() {
    const redPackets = [];
    const windowInfo = wx.getWindowInfo();
    
    // 生成50个红包，均匀分布在整个屏幕宽度上
    for (let i = 0; i < 50; i++) {
      redPackets.push({
        left: Math.random() * windowInfo.windowWidth,
        delay: Math.random() * 3, // 0-3秒的随机延迟
        size: 30 + Math.random() * 20 // 30-50rpx的随机大小
      });
    }
    this.setData({ redPackets });
  },

  triggerRedPacketRain() {
    this.initRedPackets(); // 重新初始化红包位置
    this.setData({
      isShaking: true,
      showRedPackets: true
    });
    
    // 修改为10秒后停止效果
    setTimeout(() => {
      this.setData({
        isShaking: false,
        showRedPackets: false
      });
    }, 10000);
  }
});

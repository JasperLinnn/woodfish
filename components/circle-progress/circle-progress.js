Component({
  properties: {
    percent: {
      type: Number,
      value: 0
    }
  },

  data: {
    ctx: null,
    canvas: null
  },

  lifetimes: {
    ready() {
      const query = wx.createSelectorQuery().in(this);
      query.select('#progressCanvas')
        .node()
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 固定尺寸
          canvas.width = 200;
          canvas.height = 200;
          
          this.setData({
            ctx: ctx,
            canvas: canvas
          }, () => {
            this.draw();
          });
        });
    }
  },

  methods: {
    draw() {
      const { ctx, canvas } = this.data;
      if (!ctx || !canvas) return;

      const width = 200;
      const height = 200;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 80;

      // 清空画布
      ctx.clearRect(0, 0, width, height);
      
      // 绘制底圆
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#E0E0E0';
      ctx.stroke();
      
      // 绘制进度
      if (this.properties.percent > 0) {
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          radius,
          -Math.PI / 2,
          (-Math.PI / 2) + (Math.PI * 2 * this.properties.percent / 100)
        );
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#1aad19';
        ctx.stroke();
      }
    }
  },

  observers: {
    'percent': function() {
      if (this.data.ctx && this.data.canvas) {
        this.draw();
      }
    }
  }
}); 
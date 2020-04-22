Vue.use(VJsoneditor)
var app = new Vue({
	el: '#app',
	data: function() {
		return { 
      fileList: [],
      json: null,
      display_style: 'centered',
      data: [],
      options: {
        sortObjectKeys: true,
        history: true,
        mode: 'code',
        name: 'data',
        modes: ['tree', 'code'],
      },
    }

	},
  computed: {
    height: function() {
      return window.screen.height * 0.63 + "px"
    }
  },

	methods: {
    fileCheck(file) {
      if (file.size > 500 * 1024) {
        this.$message.warning('Превышен размер файла')
        return false
      }

      if (file.type !== 'application/json') {
        this.$message.warning('Формат файла отличен от JSON')
        return false
      }
      this.parse(file)
      return true
    },

    async parse(file) {
      await file.text().then(resp => {this.json = resp})
      try {
        this.json = JSON.parse(this.json)
      }
      catch {
        this.$message.error('Неправильный формат файла')
      }
      this.display_style = 'right-aligned'
    },
    failureScan(json) {
      for (let [k, v] of Object.entries(json)) {
        if (k === 'name') {
          this.data.push({title: v})
        }
        if (k === 'child') {
          v.forEach(i => { this.failureScan(i) })
        }
      }

    },
    onError(e) {
      console.log(e)
    }
  }
})

module.exports = function helper (options) {
  return function () {
    var status = {
      error: null,
      retry: null
    }

    return {
      component: new Promise(function (resolve) {
        void function load () {
          status.error = null
          status.retry = null
          options.component().then(resolve, function (err) {
            status.error = err
            status.retry = load
          })
        }()
      }),

      loading: {
        data: function () {
          return status
        },

        render: function (h) {
          if (this.retry && options.error) {
            return h(options.error, {
              attrs: {
                error: this.error,
                retry: this.retry
              }
            })
          }

          if (!this.retry && options.loading) {
            return h(options.loading)
          }
        }
      },

      delay: 0
    }
  }
}

const components_bootstrap = {
  'progress-dialog': {
    props: ['title'],
    template: `
      <div class="modal" id="progress">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <center><progress max="100" /></center>
                </div>
            </div>
        </div>
      </div>`,
  },
  
  'modal-dialog': {
    props: ['id', 'size'],
    template: `
      <div class="modal" v-bind:id="id">
        <div class="modal-dialog" v-bind:class="(size) ? 'modal-' + size : ''">
            <div class="modal-content">
                <slot name="content"></slot>
            </div>
        </div>
      </div>`,
  },
  
  'collapse-panel': {
    props: ['id', 'collapse', 'title'],
    template: `
      <div class="accordion m-3">
        <div class="accordion-item">
          <div class="accordion-header">
            <button class="accordion-button" v-bind:class="collapse=='true' ? 'collapsed' : ''" type="button" data-bs-toggle="collapse" v-bind:href="'#' + id"><label class='title'>{{title}}</label></button>
          </div>
          <div class="accordion-collapse" v-bind:class="collapse=='true' ? 'collapse' :	'collapse show'" v-bind:id="id">
            <slot name="content"></slot>
          </div>
        </div>
      </div>`,
  },

  'config-apikey': {
    props: ['name'],
    data: function() {
      return {
        local_apikey: ""
      };
    },
    template: `
      <div class="modal fade" id="config_apikey_dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">APIキーの設定</h4>
            </div>
            <div class="modal-body">
              <label>api_key</label>
              <input type="text" class="form-control" v-model="local_apikey">
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" data-dismiss="modal" v-on:click="apply">OK</button>
              <button class="btn btn-default" data-dismiss="modal" v-on:click="cancel">キャンセル</button>
            </div>
          </div>
        </div>
      </div>  
    `,
    methods: {
      apply: function(){
        localStorage.setItem(this.name, this.local_apikey);
        this.$emit('input', this.local_apikey);
        this.$emit('change', this.local_apikey);
      },
      cancel: function(){
        this.local_apikey = localStorage.getItem(this.name) || "";
      }
    },
    mounted: function(){
      this.local_apikey = localStorage.getItem(this.name) || "";
      this.$emit('input', this.local_apikey);
    }
  }  
}

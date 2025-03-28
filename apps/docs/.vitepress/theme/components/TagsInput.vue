<template>
  <div class="label">{{ label }}</div>
  <div
    @click="focusNewTag()"
    :class="{
      'v3ti--focus': isInputActive,
      'v3ti--error': isError,
    }"
    class="v3ti"
  >
    <div class="v3ti-content">
      <span v-for="(tag, index) in innerTags" :key="index" class="v3ti-tag">
        <slot v-if="$slots.item" name="item" v-bind="{ name: tag, index }"></slot>
        <span v-else> {{ tag }} </span>
        <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="v3ti-remove-tag"></a>
      </span>
      <input
        ref="inputTag"
        :placeholder="placeholder"
        v-model="newTag"
        @keydown.delete.stop="removeLastTag"
        @keydown="addNew"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
        @input="makeItNormal"
        class="v3ti-new-tag"
      />
    </div>
  </div>
</template>

<script>
const validators = {
  email: new RegExp(/^[a-z][a-z0-9_\.]{2,50}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/),
  url: new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
  text: new RegExp(/^[a-zA-Z]+$/),
};
export default {
  name: 'Vue3TagsInput',
  emits: ['update:modelValue', 'on-limit', 'on-tags-changed', 'on-remove', 'on-error', 'on-focus', 'on-blur'],
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
    validate: {
      type: [String, Function, Object],
      default: '',
    },
    addTagOnKeys: {
      type: Array,
      default: function () {
        return [
          13, // Enter
          188, // Comma ','
          32, // Space
        ];
      },
    },
    placeholder: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: -1,
    },
    tagLength: {
      type: Number,
      default: -1,
    },
    allowDuplicates: {
      type: Boolean,
      default: false,
    },
    addTagOnBlur: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isInputActive: false,
      isError: false,
      newTag: '',
      innerTags: [],
    };
  },
  computed: {
    isLimit() {
      let isLimit = this.limit > 0 && Number(this.limit) === this.innerTags.length;
      if (isLimit) {
        this.$emit('on-limit');
      }
      return isLimit;
    },
  },
  watch: {
    error() {
      this.isError = this.error;
    },
    modelValue: {
      immediate: true,
      handler(value) {
        this.newTag = value;
      },
    },
    tags: {
      deep: true,
      immediate: true,
      handler(tags) {
        this.innerTags = [...tags];
      },
    },
    newTag() {
      if (this.tagLength !== -1 || this.newTag.length > this.tagLength) {
        this.$refs.inputTag.className = 'v3ti-new-tag v3ti-new-tag--error';
      }
    },
  },
  methods: {
    makeItNormal(event) {
      this.$emit('update:modelValue', event.target.value);
      this.$refs.inputTag.className = 'v3ti-new-tag';
      this.$refs.inputTag.style.textDecoration = 'none';
    },
    resetData() {
      this.innerTags = [];
    },
    focusNewTag() {
      if (this.readOnly || !this.$refs.inputTag) {
        return;
      }
      this.$refs.inputTag.focus();
    },
    handleInputFocus(event) {
      this.isInputActive = true;
      this.$emit('on-focus', event);
    },
    handleInputBlur(e) {
      this.isInputActive = false;
      this.addNew(e);
      this.$emit('on-blur', e);
    },
    addNew(e) {
      const keyShouldAddTag = e ? this.addTagOnKeys.indexOf(e.keyCode) !== -1 : true;
      const typeIsNotBlur = e && e.type !== 'blur';
      if ((!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) || this.isLimit) {
        return;
      }
      if (
        this.newTag &&
        (this.allowDuplicates || this.innerTags.indexOf(this.newTag) === -1) &&
        this.validateIfNeeded(this.newTag) &&
        (this.tagLength === -1 || this.newTag.length <= this.tagLength)
      ) {
        this.innerTags.push(this.newTag);
        this.newTag = '';
        this.$emit('update:modelValue', '');
        this.tagChange();
        e && e.preventDefault();
      } else {
        if (this.validateIfNeeded(this.newTag)) {
          if (this.newTag && (this.tagLength === -1 || this.newTag.length <= this.tagLength)) {
            this.makeItError(true);
          } else {
            this.makeItError('maxLength');
          }
        } else {
          this.makeItError(false);
        }
        e && e.preventDefault();
      }
    },
    makeItError(isDuplicatedOrMaxLength) {
      this.$refs.inputTag.className = 'v3ti-new-tag v3ti-new-tag--error';
      this.$refs.inputTag.style.textDecoration = 'underline';
      this.$emit('on-error', isDuplicatedOrMaxLength);
    },
    validateIfNeeded(tagValue) {
      if (this.validate === '' || this.validate === undefined) {
        return true;
      }
      if (typeof this.validate === 'function') {
        return this.validate(tagValue);
      }
      if (typeof this.validate === 'string' && Object.keys(validators).indexOf(this.validate) > -1) {
        return validators[this.validate].test(tagValue);
      }
      if (typeof this.validate === 'object' && this.validate.test !== undefined) {
        return this.validate.test(tagValue);
      }
      return true;
    },
    removeLastTag() {
      if (this.newTag) {
        return;
      }
      this.innerTags.pop();
      this.tagChange();
    },
    remove(index) {
      this.innerTags.splice(index, 1);
      this.tagChange();
      this.$emit('on-remove', index);
    },
    tagChange() {
      this.$emit('on-tags-changed', this.innerTags);
    },
  },
};
</script>

<style scoped>
.label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 3px;
  margin-left: 2px;
  display: block;
  color: var(--vp-c-text-1);
}
.v3ti {
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 13px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  transition: all 0.2s ease;
}
.v3ti--focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-lighter);
}
.v3ti--error {
  /* border-color: #f56c6c; */
}
.v3ti .v3ti-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.v3ti .v3ti-tag {
  display: flex;
  font-weight: 400;
  margin: 3px;
  padding: 0 5px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-radius: 5px;
  align-items: center;
}
.v3ti .v3ti-tag .v3ti-remove-tag {
  color: var(--vp-button-brand-text);
  transition: opacity 0.3s ease;
  opacity: 0.5;
  cursor: pointer;
  padding: 0 5px 0 7px;
  text-decoration: none;
  font-size: 15px;
}
.v3ti .v3ti-tag .v3ti-remove-tag::before {
  content: 'x';
}
.v3ti .v3ti-tag .v3ti-remove-tag:hover {
  opacity: 1;
}
.v3ti .v3ti-new-tag {
  background: transparent;
  border: 0;
  font-weight: 400;
  margin: 3px;
  outline: none;
  padding: 0 4px;
  flex: 1;
}
</style>

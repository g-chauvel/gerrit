/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';

import '@polymer/iron-input/iron-input.js';
import '../../../scripts/bundled-polymer.js';
import '../../../behaviors/gr-url-encoding-behavior/gr-url-encoding-behavior.js';
import '../../../styles/gr-form-styles.js';
import '../../../styles/shared-styles.js';
import '../../core/gr-navigation/gr-navigation.js';
import '../../shared/gr-autocomplete/gr-autocomplete.js';
import '../../shared/gr-button/gr-button.js';
import '../../shared/gr-rest-api-interface/gr-rest-api-interface.js';
import '../../shared/gr-select/gr-select.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin.js';
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {htmlTemplate} from './gr-create-change-dialog_html.js';
import {BaseUrlBehavior} from '../../../behaviors/base-url-behavior/base-url-behavior.js';

const SUGGESTIONS_LIMIT = 15;
const REF_PREFIX = 'refs/heads/';

/**
 * @appliesMixin Gerrit.URLEncodingMixin
 * @extends Polymer.Element
 */
class GrCreateChangeDialog extends mixinBehaviors( [
  BaseUrlBehavior,
  Gerrit.URLEncodingBehavior,
], GestureEventListeners(
    LegacyElementMixin(
        PolymerElement))) {
  static get template() { return htmlTemplate; }

  static get is() { return 'gr-create-change-dialog'; }

  static get properties() {
    return {
      repoName: String,
      branch: String,
      /** @type {?} */
      _repoConfig: Object,
      subject: String,
      topic: String,
      _query: {
        type: Function,
        value() {
          return this._getRepoBranchesSuggestions.bind(this);
        },
      },
      baseChange: String,
      baseCommit: String,
      privateByDefault: String,
      canCreate: {
        type: Boolean,
        notify: true,
        value: false,
      },
      _privateChangesEnabled: Boolean,
    };
  }

  /** @override */
  attached() {
    super.attached();
    if (!this.repoName) { return Promise.resolve(); }

    const promises = [];

    promises.push(this.$.restAPI.getProjectConfig(this.repoName)
        .then(config => {
          this.privateByDefault = config.private_by_default;
        }));

    promises.push(this.$.restAPI.getConfig().then(config => {
      if (!config) { return; }

      this._privateConfig = config && config.change &&
          config.change.disable_private_changes;
    }));

    return Promise.all(promises);
  }

  static get observers() {
    return [
      '_allowCreate(branch, subject)',
    ];
  }

  _computeBranchClass(baseChange) {
    return baseChange ? 'hide' : '';
  }

  _allowCreate(branch, subject) {
    this.canCreate = !!branch && !!subject;
  }

  handleCreateChange() {
    const isPrivate = this.$.privateChangeCheckBox.checked;
    const isWip = true;
    return this.$.restAPI.createChange(this.repoName, this.branch,
        this.subject, this.topic, isPrivate, isWip, this.baseChange,
        this.baseCommit || null)
        .then(changeCreated => {
          if (!changeCreated) { return; }
          Gerrit.Nav.navigateToChange(changeCreated);
        });
  }

  _getRepoBranchesSuggestions(input) {
    if (input.startsWith(REF_PREFIX)) {
      input = input.substring(REF_PREFIX.length);
    }
    return this.$.restAPI.getRepoBranches(
        input, this.repoName, SUGGESTIONS_LIMIT).then(response => {
      const branches = [];
      let branch;
      for (const key in response) {
        if (!response.hasOwnProperty(key)) { continue; }
        if (response[key].ref.startsWith('refs/heads/')) {
          branch = response[key].ref.substring('refs/heads/'.length);
        } else {
          branch = response[key].ref;
        }
        branches.push({
          name: branch,
        });
      }
      return branches;
    });
  }

  _formatBooleanString(config) {
    if (config && config.configured_value === 'TRUE') {
      return true;
    } else if (config && config.configured_value === 'FALSE') {
      return false;
    } else if (config && config.configured_value === 'INHERIT') {
      if (config && config.inherited_value) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _computePrivateSectionClass(config) {
    return config ? 'hide' : '';
  }
}

customElements.define(GrCreateChangeDialog.is, GrCreateChangeDialog);

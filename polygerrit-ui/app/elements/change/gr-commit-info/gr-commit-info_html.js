/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
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
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

export const htmlTemplate = html`
  <style include="shared-styles">
    .container {
      align-items: center;
      display: flex;
    }
  </style>
  <div class="container">
    <template is="dom-if" if="[[_showWebLink]]">
      <a target="_blank" rel="noopener" href$="[[_webLink]]"
        >[[_computeShortHash(commitInfo)]]</a
      >
    </template>
    <template is="dom-if" if="[[!_showWebLink]]">
      [[_computeShortHash(commitInfo)]]
    </template>
    <gr-copy-clipboard
      has-tooltip=""
      button-title="Copy full SHA to clipboard"
      hide-input=""
      text="[[commitInfo.commit]]"
    >
    </gr-copy-clipboard>
  </div>
`;

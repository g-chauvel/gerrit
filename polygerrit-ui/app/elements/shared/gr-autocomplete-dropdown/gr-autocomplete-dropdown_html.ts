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
import {html} from '@polymer/polymer/lib/utils/html-tag';

export const htmlTemplate = html`
  <style include="shared-styles">
    :host {
      z-index: 100;
    }
    :host([is-hidden]) {
      display: none;
    }
    ul {
      list-style: none;
    }
    li {
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-m) var(--spacing-l);
    }
    li:last-of-type {
      border: none;
    }
    li:focus {
      outline: none;
    }
    li:hover {
      background-color: var(--hover-background-color);
    }
    li.selected {
      background-color: var(--selection-background-color);
    }
    .dropdown-content {
      background: var(--dropdown-background-color);
      box-shadow: var(--elevation-level-2);
      border-radius: var(--border-radius);
      max-height: 50vh;
      overflow: auto;
    }
    @media only screen and (max-height: 35em) {
      .dropdown-content {
        max-height: 80vh;
      }
    }
    .label {
      color: var(--deemphasized-text-color);
      padding-left: var(--spacing-l);
    }
    .hide {
      display: none;
    }
  </style>
  <div
    class="dropdown-content"
    slot="dropdown-content"
    id="suggestions"
    role="listbox"
  >
    <ul>
      <template is="dom-repeat" items="[[suggestions]]">
        <li
          data-index$="[[index]]"
          data-value$="[[item.dataValue]]"
          tabindex="-1"
          aria-label$="[[item.name]]"
          class="autocompleteOption"
          role="option"
          on-click="_handleClickItem"
        >
          <span>[[item.text]]</span>
          <span class$="label [[_computeLabelClass(item)]]"
            >[[item.label]]</span
          >
        </li>
      </template>
    </ul>
  </div>
`;

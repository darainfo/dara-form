import {DaraForm} from "./DaraForm";

import "../style/daracl.form.scss";

export { DaraForm };

// 2) 브라우저 전역에 등록 (데모 실행용)
declare global {
  interface Window {
    Daracl?: any;
  }
}

if (typeof window !== "undefined") {
  window.Daracl = window.Daracl || {};
  window.Daracl.form = DaraForm;
}
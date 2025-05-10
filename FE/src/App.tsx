import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Step0ModeSelect from "./pages/Step0ModeSelect";
import Step1ClassificationSetup from "./pages/Step1ClassificationSetup";
import Step2ClassificationEdit from "./pages/Step2ClassificationEdit";
import Step3PatentClassification from "./pages/Step3PatentClassification";
import Step4PatentResult from "./pages/Step4PatentResult";
import TestTable from "./pages/TestTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step0ModeSelect />} />
        <Route path="/test" element={<TestTable />} />

        {/* 사용자 모드 */}
        <Route path="/user" element={<Layout />}>
          <Route path="step1" element={<Step1ClassificationSetup />} />
          <Route path="step2" element={<Step2ClassificationEdit />} />
          <Route path="step3" element={<Step3PatentClassification />} />
          <Route path="step4" element={<Step4PatentResult />} />
          <Route index element={<Step1ClassificationSetup />} />
        </Route>

        {/* 관리자 모드 */}
        <Route path="/admin" element={<Layout />}>
          <Route path="step1" element={<Step1ClassificationSetup />} />
          <Route index element={<Step1ClassificationSetup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

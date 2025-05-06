import { Routes, Route, BrowserRouter } from "react-router-dom";
import TestPages from "./pages/TestPages";
import Layout from "./components/Layout/Layout";

import Step0ModeSelect from "./pages/Step0ModeSelect";
import Step1ClassificationSetup from "./pages/Step1ClassificationSetup";
import Step3PatentClassification from "./pages/Step3PatentClassification";
import DataTable from "./components/DataTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step0ModeSelect />} />

        <Route path="/test" element={<TestPages />} />
          <Route path="/table" element={<DataTable />} />

        {/* 사용자 모드 */}
        <Route path="/user" element={<Layout />}>
          <Route path="step1" element={<Step1ClassificationSetup />} />
          <Route path="step3" element={<Step3PatentClassification />} />
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

import { Routes, Route, BrowserRouter } from "react-router-dom";
import TestPages from "./pages/TestPages";
import Layout from "./components/Layout/Layout";

import Step1ClassificationSetup from "./pages/Step1ClassificationSetup";
import DataTable from "./components/DataTable";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/test" element={<TestPages />} />
          <Route path="/table" element={<DataTable />} />

          {/* 사용자 모드 */}
          <Route path="/user">
            <Route path="step1" element={<Step1ClassificationSetup />} />
            <Route index element={<Step1ClassificationSetup />} />
          </Route>

          {/* 관리자 모드 */}
          <Route path="/admin">
            <Route path="step1" element={<Step1ClassificationSetup />} />
            <Route index element={<Step1ClassificationSetup />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

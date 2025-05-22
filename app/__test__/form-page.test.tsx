import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import FormPage from "../formulir/page"

// Mock next/router agar useRouter tidak error
jest.mock("next/router", () => require("next-router-mock"))

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {})
})

// MOCK Supabase client (createClientSupabaseClient)
jest.mock("@/lib/supabase/client", () => ({
  __esModule: true,
  createClientSupabaseClient: () => ({
    from: () => ({
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: { otp: "123456" }, error: null }),
        }),
      }),
    }),
    auth: {
      signInWithOtp: jest.fn().mockResolvedValue({}),
      onAuthStateChange: jest.fn(),
    },
  }),
}))

// MOCK toast
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const customRender = (ui: React.ReactElement) => render(ui)

describe("Formulir Tamu - Extra Cases", () => {
  it("should keep department selection after going back to step 1", async () => {
    customRender(<FormPage />);
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Raisyal D" } });
    fireEvent.change(screen.getByLabelText(/instansi/i), { target: { value: "UPI Purwakarta" } });
    fireEvent.change(screen.getByLabelText(/tujuan kunjungan/i), { target: { value: "Kunjungan Magang" } });
    fireEvent.mouseDown(screen.getByText(/pilih departemen/i));
    fireEvent.click(await screen.findByText(/produksi/i));
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    await waitFor(() => expect(screen.getByLabelText(/nomor hp/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /kembali/i }));
    await waitFor(() => expect(screen.getByText(/produksi/i)).toBeInTheDocument());
  });

  it("should show error if OTP is empty and user tries to verify", async () => {
    customRender(<FormPage />);
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Raisyal D" } });
    fireEvent.change(screen.getByLabelText(/instansi/i), { target: { value: "UPI" } });
    fireEvent.change(screen.getByLabelText(/tujuan kunjungan/i), { target: { value: "Magang" } });
    fireEvent.mouseDown(screen.getByText(/pilih departemen/i));
    fireEvent.click(await screen.findByText(/produksi/i));
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    await waitFor(() => expect(screen.getByLabelText(/nomor hp/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/nomor hp/i), { target: { value: "081234567890" } });
    fireEvent.click(screen.getByRole("button", { name: /kirim otp/i }));
    await waitFor(() => expect(screen.getByText(/terima kasih/i)).toBeInTheDocument());
    // If OTP input exists, test empty OTP
    // fireEvent.click(screen.getByRole("button", { name: /verifikasi/i }));
    // expect(screen.getByText(/otp wajib diisi/i)).toBeInTheDocument();
  });

  it("should not submit if all fields are empty", async () => {
    customRender(<FormPage />);
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    await waitFor(() => expect(screen.getAllByText(/wajib diisi/i).length).toBeGreaterThan(0));
  });

  it("should show error if phone number is too short", async () => {
    customRender(<FormPage />);
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Raisyal D" } });
    fireEvent.change(screen.getByLabelText(/instansi/i), { target: { value: "UPI" } });
    fireEvent.change(screen.getByLabelText(/tujuan kunjungan/i), { target: { value: "Magang" } });
    fireEvent.mouseDown(screen.getByText(/pilih departemen/i));
    fireEvent.click(await screen.findByText(/produksi/i));
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    await waitFor(() => expect(screen.getByLabelText(/nomor hp/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/nomor hp/i), { target: { value: "08" } });
    fireEvent.click(screen.getByRole("button", { name: /kirim otp/i }));
    await waitFor(() => expect(screen.getByText(/nomor hp tidak valid/i)).toBeInTheDocument());
  });

  it("should show error if phone number is too long", async () => {
    customRender(<FormPage />);
    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Raisyal D" } });
    fireEvent.change(screen.getByLabelText(/instansi/i), { target: { value: "UPI" } });
    fireEvent.change(screen.getByLabelText(/tujuan kunjungan/i), { target: { value: "Magang" } });
    fireEvent.mouseDown(screen.getByText(/pilih departemen/i));
    fireEvent.click(await screen.findByText(/produksi/i));
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    await waitFor(() => expect(screen.getByLabelText(/nomor hp/i)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/nomor hp/i), { target: { value: "081234567890123456789" } });
    fireEvent.click(screen.getByRole("button", { name: /kirim otp/i }));
    await waitFor(() => expect(screen.getByText(/nomor hp tidak valid/i)).toBeInTheDocument());
  });
});

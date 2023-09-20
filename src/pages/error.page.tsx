class ErrorPageProps {
  code: number;
}
const ErrorPage = ({ code }: ErrorPageProps) => {
  return (
    <div className="flex items-center justify-center bg-primary h-full w-full">
      <div
        className="w-full h-full absolute left-0 top-0"
        style={{
          backgroundImage: "url(" + require("assets/images/back-black.png") + ")",
          backgroundSize: "500px",
          opacity: 0.2,
          backgroundPosition: "center",
        }}
      />
      <div className="relative text-8xl font-bold text-white">{code}</div>
    </div>
  );
};
export default ErrorPage;

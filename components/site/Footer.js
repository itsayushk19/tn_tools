export default function Footer({ version }) {
  return (
    <>
      <div className="bg-gray-50 justify-center flex p-3">
        <p className="txt-black font-bold">
          VERSION: <span className="">{version.version}</span>
        </p>
      </div>
    </>
  );
}

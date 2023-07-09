import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function HashTool({ id }) {
  const router = useRouter();
  const { asPath } = router;

  // Get the last segment of the URL
  const segments = asPath.split("/");
  const lastSegment = segments[segments.length - 1];

  // Extract the first word before the dash "-"
  const words = lastSegment.split("-");
  const firstWord = words[0];
  const DynamicCalculator = dynamic(
    () => import(`../../components/calculators/${firstWord}.js`),
    {
      loading: () => <p>Loading...</p>,
    }
  );
  return (
    <>
      <DynamicCalculator />
    </>
  );
}

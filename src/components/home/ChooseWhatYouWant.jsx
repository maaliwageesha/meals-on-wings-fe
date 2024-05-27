import photo from "../../assets/21.jpg";
import SectionFlexContainer from "../SectionFlexContainer";

function ChooseWhatYouWant() {
  return (
    <SectionFlexContainer
      flex={"md:flex-row-reverse"}
      images={photo}
      title={"Choose what you want, select a pick up time"}
      description={"Delivery"}
    />
  );
}

export default ChooseWhatYouWant;

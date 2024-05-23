import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RecipePagination({ page, pageMax, searchParams }) {
  console.log("PAGINATION: ", page, pageMax, searchParams);
  // Generating a page button for a given page number or special value
  function generatePageButton(buttonText, key) {
    console.log("page", page);
    // Disabled pages: 1) "..." 2) next when there's no next 3) prev when there's no prev
    if (
      buttonText == "..." ||
      ((buttonText == "‹" || buttonText == "«") && page == 1) ||
      ((buttonText == "›" || buttonText == "»") && page == pageMax)
    )
      return (
        <Pagination.Item disabled key={key}>
          {buttonText}
        </Pagination.Item>
      );
    // Active page
    if (buttonText == page)
      return (
        <Pagination.Item key={key} active>
          {buttonText}
        </Pagination.Item>
      );
    // Control buttons
    let newParams = new URLSearchParams(searchParams);
    if (buttonText == "‹") newParams.set("page", page - 1);
    else if (buttonText == "›") newParams.set("page", page + 1);
    else if (buttonText == "«") newParams.set("page", 1);
    else if (buttonText == "»") newParams.set("page", pageMax);
    else newParams.set("page", buttonText);

    return (
      <Pagination.Item
        key={key}
        onClick={() => navigate("/recipes?" + newParams.toString())}
      >
        {buttonText}
      </Pagination.Item>
    );
  }
  const navigate = useNavigate();

  // Generating a list of buttons
  let buttonList = [];
  // "Previous" and "first" buttons
  buttonList.push("«");
  buttonList.push("‹");
  if (pageMax <= 5) {
    // Small number of pages; no pagination reductions
    for (let i = 1; i <= pageMax; i++) buttonList.push(i);
  } else {
    // Large number of pages; pagination reductions with "..."
    if (page > 3) {
      // [1] [...] [10] [11] [ACTIVE]
      buttonList.push(1);
      buttonList.push("...");
      for (let i = page - 2; i < page; i++) buttonList.push(i);
    } else {
      // [1] [2] [ACTIVE]
      for (let i = 1; i < page; i++) buttonList.push(i);
    }
    if (pageMax - page >= 3) {
      // [ACTIVE] [13] [14] [...] [99]
      for (let i = page; i <= page + 2; i++) buttonList.push(i);
      buttonList.push("...");
      buttonList.push(pageMax);
    } else {
      // [ACTIVE] [4] [5]
      for (let i = page; i <= getPageMaxNumber(recipes); i++)
        buttonList.push(i);
    }
  }
  // "Next" and "last" buttons
  buttonList.push("›");
  buttonList.push("»");
  // Generating actual buttons from the list

  return (
    <Pagination>
      {buttonList.map((item, index) => generatePageButton(item, index))}
    </Pagination>
  );
}

import PricesOfToday from '../../components/PricesOfToday';
import '../../globals.css';

export default function Page()

{
    return  (
      <>
    
    <h1 className="text-3xl">Today's prices</h1>
    <div><PricesOfToday /></div>
  </>
    )
}
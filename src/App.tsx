
import './App.css'
import Promodoro from '@/components/promodoro/promodoro'
import {TooltipProvider} from "@/components/ui/tooltip"




function App() {




 

  return (
    <>
      <TooltipProvider>
        <Promodoro />
      </TooltipProvider> 
    </>
  )
}

export default App

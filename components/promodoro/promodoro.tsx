import { type MODES, type Etap, DEFAULT_MODES} from '@/types/types'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { MoreHorizontalIcon,} from 'lucide-react'
import {  useEffect, useState } from 'react'

function Promodoro() {

    const [modes, setModes] = useState<MODES>({
        ...DEFAULT_MODES
    });

    const [mode,setMode] = useState<Etap>("focus");
    const [time, setTime] = useState(modes[mode]);
    const [isActive, setIsActive] = useState(false);
    const [session, setSession] = useState(0);

    const [focusInput, setFocusInput] = useState(modes.focus / 60);
    const [shortBreakInput, setShortBreakInput] = useState(modes.shortBreak / 60);
    const [longBreakInput, setLongBreakInput] = useState(modes.longBreak / 60);
    const [sessionsBetweenBreaksInput, setSessionsBetweenBreaksInput] = useState(3);


  const formatTime = (time:number) => {
    const days = Math.floor(time / 86400);

    const remainingAfterDays = time % 86400;

    const hours = Math.floor(remainingAfterDays / 3600);

    const remainingAfterHours = remainingAfterDays % 3600;

    const minutes = Math.floor(remainingAfterHours / 60);

    const seconds = remainingAfterHours % 60;

    const str =`${days > 0 ? `${days}:` : ''}${hours > 0 || days > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return { days, hours, minutes, seconds, str };
  }

  const formattedTime = formatTime(time);


  const changeMode = (newMode: Etap) => {
    setMode(newMode);
    setTime(modes[newMode]);
    setIsActive(false);
  }

  const handleSaveChanges = (e: React.FormEvent) => {
  e.preventDefault();

  setModes({
    focus: focusInput * 60,
    shortBreak: shortBreakInput * 60,
    longBreak: longBreakInput * 60,
    sessionsBetweenBreaks: sessionsBetweenBreaksInput,
  });
};

  const handleResetDefaults = () => {
    setModes({
        ...DEFAULT_MODES
    });

    setFocusInput(DEFAULT_MODES.focus / 60);
    setShortBreakInput(DEFAULT_MODES.shortBreak / 60);
    setLongBreakInput(DEFAULT_MODES.longBreak / 60);
    setSessionsBetweenBreaksInput(DEFAULT_MODES.sessionsBetweenBreaks);
  };


const getNextMode = (mode: Etap, session: number): Etap => {
  if (mode === "focus") {
    // după 3 focus-uri → long break
    if (session === modes.sessionsBetweenBreaks) {
      console.log("long break", session);
      return "longBreak";
    }
    return "shortBreak";
  }

  if (mode === "shortBreak") {
    return "focus";
  }

  // după long break → focus reset
  return "focus";
};


  const handleStart = () => setIsActive(true);
 

  const handlePause = () => setIsActive(false);
  

  const handleReset = () => {
    setIsActive(false);
    setTime(modes[mode]);
  }

  const handleAddTime = (additionalTime: number) => {
    setTime((prevTime) => prevTime + additionalTime);
  }
useEffect(() => {
  setTime(modes[mode]);
}, [modes, mode]);
  useEffect(() => {
    if(!isActive) return;

    
    const interval = setInterval(() => {
      setTime((prev) => {
       if(prev > 0) return prev - 1;

        
        
        setSession((prevSession) => {
        const newSession = mode === "focus" ? prevSession + 1 : prevSession;
        
            if(mode === "focus") {
                const startAudio = new Audio("/sounds/done.mp3");
                startAudio.play();
            } 

        const nextMode = getNextMode(mode, newSession);

        setMode(nextMode);
        setTime(modes[nextMode]);
        if(mode === "longBreak") {
            setIsActive(false);
            setSession(0);
        } 
        return newSession;
      });
      return 0;
      })
    }, 1000)
    return () => clearInterval(interval);
  }, [isActive, session, mode])

  useEffect(()=> {
    document.title = formatTime(time).str + " - Pomodoro Timer";
  }, [time])

    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen gap-4'>
                <span>Number of Sessions: {session}</span>
                <span>Current Mode: {mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}</span>
                <span>Current Session Max: {modes.sessionsBetweenBreaks}</span>
          <ButtonGroup>
              <Button variant="secondary" size="lg" className={`cursor-pointer ${mode === 'focus' ? 'bg-gray-800/80 text-white hover:text-black' : ''}`} onClick={()=> changeMode('focus')}> Focus </Button>
              <Button variant="secondary" size="lg" className={`cursor-pointer ${mode === 'shortBreak' ? 'bg-gray-800/80 text-white hover:text-black' : ''}`} onClick={()=> changeMode('shortBreak')}> Short Break </Button>
              <Button variant="secondary" size="lg" className={`cursor-pointer ${mode === 'longBreak' ? 'bg-gray-800/80 text-white hover:text-black' : ''}`} onClick={()=> changeMode('longBreak')}> Long Break </Button>
          </ButtonGroup>
          <h1 className='text-4xl font-bold cursor-pointer'>

            {formattedTime.days > 0 ? (
              <Tooltip>
              <TooltipTrigger asChild>
                <span>{formattedTime.days}:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>days</p>
              </TooltipContent>
            </Tooltip>
            ) : null}
            {formattedTime.hours > 0 || formattedTime.days > 0 ? (
              <Tooltip>
              <TooltipTrigger asChild>
                <span>{formatTime(time).hours.toString().padStart(2, '0')}:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>hours</p>
              </TooltipContent>
            </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{formattedTime.minutes.toString().padStart(2, '0')}:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>minutes</p>
              </TooltipContent>
            </Tooltip>
            

              <Tooltip>
              <TooltipTrigger asChild>
                <span>{formattedTime.seconds.toString().padStart(2, '0')}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>seconds</p>
              </TooltipContent>
            </Tooltip>
            
          </h1>
            <ButtonGroup>
                <Button variant="ghost" size="lg" onClick={() => handleAddTime(25 * 60)}> +25 mins </Button>
                <Button variant="ghost" size="lg" onClick={() => handleAddTime(10 * 60)}> +10 mins </Button>
                <Button variant="ghost" size="lg" onClick={() => handleAddTime(5 * 60)}> +5 mins </Button>
                <Button variant="ghost" size="lg" onClick={() => handleAddTime(1 * 60)}> +1 min </Button>
            </ButtonGroup>
          <ButtonGroup>
            {isActive ? <Button variant="outline" size="lg"  onClick={handlePause}>
              Pause
            </Button> : <Button variant="outline" size="lg"  onClick={handleStart}>
              Start
            </Button>}
            
                <Button variant="outline" size="lg" onClick={handleReset}>Reset</Button>
                {/* <Button variant="outline" size="lg" aria-label="More Options">
                            <MoreHorizontalIcon />
                        </Button> */}
                <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" aria-label="More Options">
                            <MoreHorizontalIcon />
                        </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
      <form onSubmit={(e) => handleSaveChanges(e)} >

          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid grid-cols-2 sm:grid-cols-2">
            <Field>
              <Label htmlFor="name-1">Focus Time (minutes):</Label>
              <Input id="name-1" name="focus-time" value={focusInput} onChange={(e) => setFocusInput(Number(e.target.value))}/>
            </Field>
            <Field>
              <Label htmlFor="username-1">Short Break Time (minutes):</Label>
              <Input id="username-1" name="short-break-time" value={shortBreakInput} onChange={(e) => setShortBreakInput(Number(e.target.value))} />
            </Field>
            <Field>
              <Label htmlFor="username-1">Long Break Time (minutes):</Label>
              <Input id="username-1" name="long-break-time" value={longBreakInput} onChange={(e) => setLongBreakInput(Number(e.target.value))} />
            </Field>
            <Field>
              <Label htmlFor="username-1">Number of sessions :</Label>
              <Input id="username-1" name="sessions-between-breaks" value={sessionsBetweenBreaksInput} onChange={(e) => setSessionsBetweenBreaksInput(Number(e.target.value))} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={handleResetDefaults} type="button">
                  Default
                </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button type="submit">Save changes</Button>
                
            </DialogClose>
                
          </DialogFooter>
      </form>

        </DialogContent>
    </Dialog>
          </ButtonGroup>
        </div>
        </>
    )
}


export default Promodoro
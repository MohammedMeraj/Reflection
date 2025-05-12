"use client"
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'


import React from 'react'




const Query = () => {
    const getSample = useQuery(api.sample.getSample,{email:'myemail'})
    

    const createSample = useMutation(api.sample.addSample)

            const emailrere = "iheroghe"
            const namerere  = "myemail"
            const phonerere  = 25235223425

    
      
       const add = () => {
   createSample({
                name:namerere ,
                email:emailrere,
                phone:phonerere,
            })
}
        
   


  return (
    <div>Query

      <Button onClick={add}>Add Data</Button>

    </div>
  )
}

export default Query
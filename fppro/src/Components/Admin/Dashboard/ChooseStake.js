import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function ChooseStake() {
  const navigate = useNavigate();

  const handleNavigation = (stakeholderType) => {
    navigate('/admin-profile/dashboard', { state: { typeOfStakeholder: stakeholderType } });
  };

  return (
    <div className='text-center'>
      <h2 className='mb-5 mt-2'>Choose a stakeholder</h2>
      <Button variant="contained" className='w-75 mb-3 mt-3' onClick={() => handleNavigation('Alumni')}>Alumni</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Faculty')}>Faculty</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Parent')}>Parent</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Student_theory')}>Student (Theory)</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Student_laboratory')}>Student (Laboratory)</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Graduate_exit_institution')}>Graduate Exit (Institution)</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Graduate_exit_department')}>Graduate Exit (Department)</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Industry')}>Industry</Button>
      <Button variant="contained" className='w-75 mb-3' onClick={() => handleNavigation('Professional')}>Professional Body</Button>
    </div>
  );
}

export default ChooseStake;

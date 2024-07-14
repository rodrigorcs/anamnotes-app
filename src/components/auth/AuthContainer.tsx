import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import signUpImage from '../../../public/assets/images/sign-up.png'

export const AuthContainer: FC = () => {
  return (
    <div className="tw-flex-1 tw-flex tw-p-4 tw-justify-end">
      <div className="tw-flex-1 tw-flex tw-pl-24 tw-pr-28 tw-pt-16 tw-py-28 tw-max-w-[42rem]">
        <Outlet />
      </div>
      <div className="tw-flex-1 tw-flex tw-flex-col tw-bg-[#EDF2FF] tw-max-w-[56rem]">
        <h2 className="tw-text-brand-500 tw-text-4xl tw-leading-[3rem] tw-px-24 tw-mt-16 tw-text-center">
          Resuma as suas anamneses <span className="tw-font-semibold">automaticamente</span>.
        </h2>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-end">
          <div className="tw-flex-1 tw-flex tw-align-end tw-pl-8 tw-mt-8 tw-max-w-[56rem] tw-items-center">
            <img
              src={signUpImage}
              alt="Anamnotes demo"
              className="tw-object-right tw-object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

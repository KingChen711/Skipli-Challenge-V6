import { cn } from '~/lib/utils'

export type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  Loader: ({ className, ...props }: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('animate-spin', className)}
      {...props}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  ),

  Instructor: ({ className, ...props }: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='200'
      height='200'
      viewBox='0 0 36 36'
      {...props}
      className={cn(className)}
    >
      <path fill='#D99E82' d='M30 26a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v22z' />
      <path fill='#5C913B' d='M28 26a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v22z' />
      <path
        fill='#FFF'
        d='M7.515 8.898c-.08.096-.184.24-.184.408c0 .368.272.528.624.528h2.67c.304 0 .576-.16.576-.528s-.271-.528-.624-.528H9.114c.679-.855 1.919-1.958 1.919-3.07c0-1.015-.792-1.663-1.775-1.663s-1.879.807-1.879 1.815c0 .311.2.583.584.583c.768 0 .328-1.295 1.247-1.295c.328 0 .576.288.576.616c0 .288-.136.536-.28.744c-.608.879-1.327 1.599-1.991 2.39zm-1.307 5.433H5.049v-1.16c0-.288-.184-.479-.48-.479c-.295 0-.479.192-.479.479v1.16H2.931c-.296 0-.48.192-.48.479c0 .288.184.48.48.48H4.09v1.159c0 .288.184.479.479.479c.296 0 .48-.191.48-.479V15.29h1.159c.296 0 .48-.192.48-.48c0-.287-.184-.479-.48-.479zm4.369 1.447H9.113c.68-.855 1.919-1.958 1.919-3.07c0-1.015-.792-1.663-1.775-1.663s-1.879.808-1.879 1.815c0 .311.2.583.583.583c.768 0 .328-1.295 1.248-1.295c.328 0 .576.288.576.616c0 .288-.136.536-.28.744c-.608.879-1.327 1.599-1.991 2.391c-.08.096-.184.24-.184.408c0 .368.272.528.624.528h2.67c.304 0 .576-.16.576-.528c0-.369-.271-.529-.623-.529zm.84 3.192H3.083a.5.5 0 0 1 0-1h8.333a.5.5 0 0 1 .001 1z'
      />
      <path fill='#CCD6DD' d='M36 36v-2a6 6 0 0 0-6-6H14a6 6 0 0 0-6 6v2h28z' />
      <path
        fill='#99AAB5'
        d='M22.073 30.805s3.297.891 4.545 1.307c.16.053-.951-2.108-.951-2.108h-7.453s-.679 1.542-1.071 2.197c1.96-.624 4.798-1.485 4.798-1.485'
      />
      <path
        fill='#FFDC5D'
        d='M17.64 28.101c.774.562 1.206 1.644 2.3 1.911c.326.702.746 1.635 1.122 2.476c.355.795 1.486.783 1.825-.02c.355-.84.755-1.767 1.074-2.456c1.105-.446 1.611-1.339 2.399-1.911V24.29h-8.72v3.811z'
      />
      <path
        fill='#F9CA55'
        d='M17.632 25.973c1.216 1.374 2.724 1.746 4.364 1.746c1.639 0 3.146-.373 4.363-1.746v-3.491h-8.728v3.491z'
      />
      <path
        fill='#FFAC33'
        d='M25.731 3.323c-1.925-.623-6.455-.453-7.588 1.019c-2.944.057-6.398 2.718-6.851 6.228c-.448 3.475.551 5.088.906 7.701c.403 2.96 2.067 3.907 3.397 4.303c1.914 2.529 3.949 2.421 7.366 2.421c6.672 0 9.85-4.464 10.131-12.047c.17-4.585-2.521-8.059-7.361-9.625z'
      />
      <path
        fill='#FFDC5D'
        d='M29.547 13.273c-.646-.894-1.472-1.614-3.284-1.868c.68.311 1.331 1.387 1.416 1.982c.085.595.17 1.076-.368.481c-2.155-2.382-4.502-1.444-6.827-2.899c-1.624-1.016-2.119-2.141-2.119-2.141s-.198 1.5-2.661 3.029c-.714.443-1.566 1.43-2.038 2.888c-.34 1.048-.234 1.982-.234 3.578c0 4.66 3.841 8.578 8.578 8.578s8.578-3.953 8.578-8.578c-.002-2.898-.305-4.031-1.041-5.05z'
      />
      <path fill='#C1694F' d='M22.961 20.707h-1.906a.477.477 0 1 1 0-.954h1.906a.477.477 0 1 1 0 .954z' />
      <path
        fill='#662113'
        d='M18.195 17.37a.953.953 0 0 1-.953-.953v-.953a.953.953 0 0 1 1.906 0v.953a.952.952 0 0 1-.953.953zm7.626 0a.953.953 0 0 1-.953-.953v-.953a.953.953 0 0 1 1.906 0v.953a.953.953 0 0 1-.953.953z'
      />
      <path
        fill='#C1694F'
        d='M22.134 24.686c-2.754 0-3.6-.705-3.741-.848a.655.655 0 0 1 .902-.95c.052.037.721.487 2.839.487c2.2 0 2.836-.485 2.842-.49a.638.638 0 0 1 .913.015a.669.669 0 0 1-.014.938c-.142.143-.987.848-3.741.848'
      />
      <path
        fill='#F5F8FA'
        d='M17.229 26.629c.565.566 2.71 3.383 2.71 3.383s-1.188.695-2.608 2.004c-.516.476-1.35.055-1.287-.644c.121-1.349.249-2.909.225-3.534c-.011-.303.69-1.481.96-1.209m9.433 0c-.565.566-2.71 3.383-2.71 3.383s1.188.695 2.608 2.004c.516.476 1.35.055 1.287-.644c-.121-1.349-.249-2.909-.225-3.534c.012-.303-.689-1.481-.96-1.209'
      />
    </svg>
  ),
  Student: ({ className, ...props }: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 36 36'
      {...props}
      className={cn(className)}
    >
      <path fill='#292F33' d='M26 28H10a6 6 0 0 0-6 6v2h28v-2c0-3.314-2.685-6-6-6z'></path>
      <path
        fill='#66757F'
        d='M8.083 33.341c.251 0 .401 2.659.401 2.659h-.956s.193-2.659.555-2.659m3 0c.251 0 .401 2.659.401 2.659h-.957c.001 0 .194-2.659.556-2.659m13.846 0c-.251 0-.401 2.659-.401 2.659h.956c-.001 0-.194-2.659-.555-2.659m3 0c-.251 0-.401 2.659-.401 2.659h.956c-.001 0-.194-2.659-.555-2.659'
      ></path>
      <path
        fill='#FA743E'
        d='M12.38 28s.24.838.77 1.971c.827 1.766 2.366 4.254 4.85 5.441c2.485-1.187 4.024-3.675 4.85-5.441c.53-1.133.77-1.971.77-1.971H12.38z'
      ></path>
      <path
        fill='#DD551F'
        d='M18 32c2.329 0 3.882-1.02 4.85-2.029c.53-1.133.77-1.971.77-1.971H12.38s.24.838.77 1.971C14.118 30.98 15.671 32 18 32z'
      ></path>
      <path
        fill='#FFDC5D'
        d='M13.64 28.106c0 .894 2.36 1.993 4.36 1.993s4.359-1.099 4.359-1.992V24.29h-8.72v3.816z'
      ></path>
      <path
        fill='#F9CA55'
        d='M13.632 25.973c1.216 1.374 2.724 1.746 4.364 1.746c1.639 0 3.146-.373 4.363-1.746v-3.491h-8.728v3.491z'
      ></path>
      <path
        fill='#FFAC33'
        d='M21.152 3.3c-1.925-.623-5.876-.46-7.008 1.012c-2.944.057-6.083 2.932-6.536 6.443c-.448 3.475.235 4.874.591 7.486c.403 2.96 2.067 3.907 3.397 4.303c1.914 2.529 3.949 2.421 7.366 2.421c6.672 0 9.271-4.458 9.552-12.04c.169-4.585-2.522-8.059-7.362-9.625z'
      ></path>
      <path
        fill='#FFDC5D'
        d='M25.547 13.244c-.646-.894-1.472-1.614-3.284-1.868c.68.311 1.331 1.387 1.416 1.982c.085.595.17 1.076-.368.481c-2.155-2.382-4.502-1.444-6.827-2.899c-1.624-1.016-2.119-2.141-2.119-2.141s-.198 1.5-2.661 3.029c-.714.443-1.566 1.43-2.038 2.888c-.34 1.048-.234 1.982-.234 3.578c0 4.66 3.841 8.578 8.578 8.578s8.578-3.953 8.578-8.578c-.002-2.899-.305-4.031-1.041-5.05z'
      ></path>
      <path fill='#C1694F' d='M18.961 20.677h-1.906a.477.477 0 1 1 0-.954h1.906a.477.477 0 1 1 0 .954z'></path>
      <path
        fill='#662113'
        d='M14.195 17.341a.953.953 0 0 1-.953-.953v-.953a.953.953 0 0 1 1.906 0v.953a.953.953 0 0 1-.953.953zm7.626 0a.953.953 0 0 1-.953-.953v-.953a.953.953 0 0 1 1.906 0v.953a.953.953 0 0 1-.953.953z'
      ></path>
      <path
        fill='#C1694F'
        d='M18.134 24.657c-2.754 0-3.6-.705-3.741-.848a.655.655 0 0 1 .902-.95c.052.037.721.487 2.839.487c2.2 0 2.836-.485 2.842-.49a.638.638 0 0 1 .913.015a.67.67 0 0 1-.014.939c-.142.142-.987.847-3.741.847'
      ></path>
      <path
        fill='#292F33'
        d='m32.104 3.511l-14-3a.491.491 0 0 0-.209 0l-14 3a.5.5 0 0 0-.032.97l4.944 1.413C8.615 6.489 8.5 7.176 8.5 8c0 2.29 3.285 3.5 9.5 3.5s9.5-1.21 9.5-3.5c0-.824-.115-1.511-.307-2.106l4.945-1.413a.5.5 0 0 0-.034-.97z'
      ></path>
      <path
        fill='#66757F'
        d='M32.48 3.863a.502.502 0 0 0-.618-.344L18 7.48L4.137 3.519a.5.5 0 1 0-.274.962l14 4a.49.49 0 0 0 .273 0l14-4a.498.498 0 0 0 .344-.618z'
      ></path>
      <path
        fill='#FFCC4D'
        d='m17.958 3.502l-12 1c-.026.002-.458.057-.458.498v6.095c-.299.186-.5.74-.5 2.405c0 2.485.448 4.5 1 4.5s1-2.015 1-4.5c0-1.665-.201-2.219-.5-2.405V5.46l11.542-.962a.5.5 0 0 0-.084-.996z'
      ></path>
    </svg>
  ),
  Lesson: ({ className, ...props }: IconProps) => (
    <svg
      width='800px'
      height='800px'
      viewBox='0 0 64 64'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
      className={cn(className)}
    >
      <g data-name='09_Idea' id='_09_Idea'>
        <path
          d='M59,62H5a1,1,0,0,1-1-1V28a1,1,0,0,1,1-1H59a1,1,0,0,1,1,1V61A1,1,0,0,1,59,62Z'
          style={{
            fill: '#03a65a'
          }}
        />
        <path
          d='M55,22H9a1,1,0,0,0-1,1V57a1,1,0,0,0,1,1H23.69A16.949,16.949,0,0,1,31,59.65q.255.1.51.24a1.03,1.03,0,0,0,.45.11.988.988,0,0,0,.45-.1l.21-.11c.12-.06.25-.12.38-.17A17.119,17.119,0,0,1,40.24,58H55a1,1,0,0,0,1-1V23A1,1,0,0,0,55,22Z'
          style={{
            fill: '#fdfeff'
          }}
        />
        <path
          d='M33,39V59.62c-.13.05-.26.11-.38.17l-.21.11a.988.988,0,0,1-.45.1,1.03,1.03,0,0,1-.45-.11q-.255-.135-.51-.24V39Z'
          style={{
            fill: '#dfeaef'
          }}
        />
        <path
          d='M33.515,61.579A15.179,15.179,0,0,1,40.237,60H55a3,3,0,0,0,3-3V27H57V57a2,2,0,0,1-2,2H40.237a16.183,16.183,0,0,0-7.168,1.684l-.216.107a2,2,0,0,1-1.8-.012A16.173,16.173,0,0,0,23.692,59H9a2,2,0,0,1-2-2V27H6V57a3,3,0,0,0,3,3H23.692a15.163,15.163,0,0,1,6.9,1.669A3.02,3.02,0,0,0,31.963,62a2.984,2.984,0,0,0,1.334-.313Z'
          style={{
            fill: '#c3d6dd'
          }}
        />
        <path
          d='M56,57a1,1,0,0,1-1,1H40.237a17.189,17.189,0,0,0-7.613,1.788l-.216.107a.993.993,0,0,1-.445.1,1.006,1.006,0,0,1-.457-.11A17.164,17.164,0,0,0,23.692,58H9a1,1,0,0,1-1-1V26H7V57a2,2,0,0,0,2,2H23.692a16.173,16.173,0,0,1,7.357,1.779,2,2,0,0,0,1.8.012l.216-.107A16.183,16.183,0,0,1,40.237,59H55a2,2,0,0,0,2-2V26H56Z'
          style={{
            fill: '#dfeaef'
          }}
        />
        <path
          d='M18,34a1,1,0,0,1-.555-.168L15,32.2l-2.445,1.63A1,1,0,0,1,11,33V22h8V33a1,1,0,0,1-1,1Z'
          style={{
            fill: '#d6e8f2'
          }}
        />
        <path
          d='M19,33a1,1,0,0,1-.555-.168L16,31.2l-2.445,1.63A1,1,0,0,1,12,32V22h8V32a1,1,0,0,1-1,1Z'
          style={{
            fill: '#f74e0c'
          }}
        />
        <path
          d='M14,32V22H12V32a1,1,0,0,0,1.555.832l.563-.375A.986.986,0,0,1,14,32Z'
          style={{
            fill: '#e03a07'
          }}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={13}
          y={38}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={13}
          y={42}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={13}
          y={46}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={7}
          x={13}
          y={50}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={36}
          y={38}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={36}
          y={42}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={36}
          y={46}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={15}
          x={36}
          y={50}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={2}
          x={22}
          y={50}
        />
        <rect
          height={2}
          style={{
            fill: '#d6e8f2'
          }}
          width={2}
          x={26}
          y={50}
        />
        <rect
          height={4}
          style={{
            fill: '#febc00'
          }}
          width={2}
          x={31}
          y={2}
        />
        <rect
          height={4}
          style={{
            fill: '#febc00'
          }}
          transform='translate(0.277 13.054) rotate(-29.998)'
          width={2}
          x={23.5}
          y={4.009}
        />
        <rect
          height={4}
          style={{
            fill: '#febc00'
          }}
          transform='translate(-0.455 22.212) rotate(-59.998)'
          width={2}
          x={18.009}
          y={9.5}
        />
        <rect
          height={2}
          style={{
            fill: '#febc00'
          }}
          width={4}
          x={15}
          y={18}
        />
        <rect
          height={2}
          style={{
            fill: '#febc00'
          }}
          width={4}
          x={45}
          y={18}
        />
        <rect
          height={2}
          style={{
            fill: '#febc00'
          }}
          transform='translate(0.276 24.032) rotate(-29.995)'
          width={4}
          x={42.991}
          y={10.5}
        />
        <rect
          height={2}
          style={{
            fill: '#febc00'
          }}
          transform='translate(14.548 37.215) rotate(-60.005)'
          width={4}
          x={37.5}
          y={5.009}
        />
        <path
          d='M27,31v3.512a3.122,3.122,0,0,0,1.274,2.56,5.645,5.645,0,0,0,.552.341c.062.034.125.063.188.094.121.06.241.115.362.163.076.03.151.059.227.085.1.035.208.065.312.092.084.022.168.047.251.064s.149.022.223.033a4.168,4.168,0,0,0,.645.046c.031,0,.063,0,.094,0a3.746,3.746,0,0,0,.385-.033c.027,0,.053-.006.08-.011A4,4,0,0,0,35,34V30.576a9.834,9.834,0,0,1,2.7-6.571,8.917,8.917,0,0,0,1.344-2H22.937a9.049,9.049,0,0,0,1.437,2.091A10.148,10.148,0,0,1,27,31Z'
          style={{
            fill: '#d6e8f2'
          }}
        />
        <path
          d='M35,31H29a1,1,0,0,1-1-1,10.148,10.148,0,0,0-2.626-6.909,9,9,0,1,1,15.552-7.263h0A9.036,9.036,0,0,1,38.7,23.005,9.834,9.834,0,0,0,36,29.576V30A1,1,0,0,1,35,31Z'
          style={{
            fill: '#febc00'
          }}
        />
        <path
          d='M30,30a10.148,10.148,0,0,0-2.626-6.909A8.989,8.989,0,0,1,33.04,8.059a9,9,0,0,0-7.666,15.032A10.148,10.148,0,0,1,28,30a1,1,0,0,0,1,1h2A1,1,0,0,1,30,30Z'
          style={{
            fill: '#edaa03'
          }}
        />
        <path
          d='M33,30H31V20a1,1,0,0,1,.293-.707l3-3,1.414,1.414L33,20.414Z'
          style={{
            fill: '#fdfeff'
          }}
        />
        <rect
          height={4.389}
          style={{
            fill: '#fdfeff'
          }}
          transform='translate(-4.127 26.934) rotate(-45)'
          width={2}
          x={29.448}
          y={16.254}
        />
        <path
          d='M29.274,36.072A3.122,3.122,0,0,1,28,33.512V29h8v4C36,36.078,32.506,38.356,29.274,36.072Z'
          style={{
            fill: '#f74e0c'
          }}
        />
        <path
          d='M31.274,36.072A3.122,3.122,0,0,1,30,33.512V29H28v4.512a3.122,3.122,0,0,0,1.274,2.56,4.437,4.437,0,0,0,3.713.8A5.056,5.056,0,0,1,31.274,36.072Z'
          style={{
            fill: '#e03a07'
          }}
        />
        <circle
          cx={18}
          cy={25}
          r={1}
          style={{
            fill: '#f74e0c'
          }}
        />
      </g>
    </svg>
  ),
  Message: ({ className, ...props }: IconProps) => (
    <svg
      width='800px'
      height='800px'
      viewBox='0 0 1024 1024'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
      className={cn('icon', className)}
    >
      <path
        d='M896 192H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h576.6l191.6 127.7L896 832c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64z'
        fill='#3D5AFE'
      />
      <path
        d='M640 512c0-125.4-51.5-238.7-134.5-320H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h377.5c83-81.3 134.5-194.6 134.5-320z'
        fill='#536DFE'
      />
      <path d='M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z' fill='#FFFF8D' />
      <path d='M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z' fill='#FFFF00' />
      <path d='M768 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z' fill='#FFEA00' />
    </svg>
  ),
  Profile: ({ className, ...props }: IconProps) => (
    <svg
      width='800px'
      height='800px'
      viewBox='0 0 43.015 43.015'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
      className={cn(className)}
    >
      <path
        id='profile'
        d='M527.352,255.432a2.6,2.6,0,0,1-1.915,1.915,98.592,98.592,0,0,1-35.891,0,2.6,2.6,0,0,1-1.915-1.915,98.571,98.571,0,0,1,0-35.888,2.6,2.6,0,0,1,1.915-1.915,98.592,98.592,0,0,1,35.891,0,2.6,2.6,0,0,1,1.915,1.915A98.567,98.567,0,0,1,527.352,255.432ZM520.825,244.6a24.835,24.835,0,0,0-6.644-4.225,9.1,9.1,0,1,0-12.647.136,25.24,25.24,0,0,0-6.31,4.089q-12.8,11.021,12.8,11.021T520.825,244.6Zm-12.8-6.049c-1.477,0-2.674-.716-2.674-1.6a1,1,0,0,1,.094-.4,2.626,2.626,0,0,1-.094-.663h.688a3.939,3.939,0,0,1,3.973,0h.688a2.626,2.626,0,0,1-.094.663,1,1,0,0,1,.094.4C510.7,237.832,509.5,238.548,508.024,238.548Z'
        transform='translate(-485.984 -215.983)'
        fill='#2d5be2'
      />
    </svg>
  )
}

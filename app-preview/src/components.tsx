/**
 * @example
 *  import { AtIcon, MlInfoPanel } from '@atlassian/hubba-components-library';
 * import ReactMarkdown from 'react-markdown';
 * import remarkGfm from 'remark-gfm';
 *
 * const components: Record<string, (props: any) => JSX.Element> = {
 *   AtIcon: (props) => <AtIcon {...props} />,
 *   MlInfoPanel: (props) => (
 *     <MlInfoPanel {...props}>
 *       <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.description}</ReactMarkdown>
 *     </MlInfoPanel>
 *   ),
 * }

 * export default components;
 **/

const components: Record<string, (props: any) => JSX.Element> = {
  // Add your components here
};

export default components;